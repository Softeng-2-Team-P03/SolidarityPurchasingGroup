'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const productDao = require('./product-dao');
const orderDao = require('./order-dao');
const Dao = require('./dao.js');
const userDao = require('./user-dao.js'); // module for accessing the users in the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const fileUpload = require('express-fileupload');
const nodemailer = require('nodemailer');
const credentials = require('./credentials');
//import { gmailcredentials } from './credentials.js';
const notificationDao = require('./notification-dao.js');
const dateRegexp = new RegExp(/^(([1]|[2])\d{3})-((0[13578]|1[02])-(0[0-9]|[1-2][0-9]|3[0-1])|(0[469]|11)-(0[0-9]|[1-2][0-9]|30)|(02)-(0[0-9]|[1-2][0-9]))([ ])([01][1-9]|2[0-3])(\:)([0-5][0-9])(\:)([0-5][0-9])$/);
/* SETUP SECTION */

/* Set up Passport **
set up the "username and password" login strategy
by setting a function to verify username and password*/
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));

/* serialize and de-serialize the user (user object <-> session)
 we serialize the user id and we store it in the session: the session is very small in this way*/
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

// init express
const app = express();
app.disable("x-powered-by");
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: credentials.gmailcredentials.GMAILUSER,
        pass: credentials.gmailcredentials.GMAILPASSWORD
    }
});

/* API SECTION */

// DELETE /sessions/current ->logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

// GET /sessions/current-> check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });
});

// POST /sessions -> login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => { //NOSONAR
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});


//****************************************************** */
//                User API
//****************************************************** */
//**** Post New Client****//
app.post('/api/new_client', [
    check(['name']).notEmpty(),
    check('surname').notEmpty(),
    check('email').notEmpty(),
    check('password').isLength({ min: 8, max: 30 }),
    check('phoneNumber').isLength({ min: 10, max: 10 }),
    check('address').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const client = {
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        accessType: req.body.accessType,
        wallet: req.body.wallet,
        address: req.body.address
    };

    try {
        await Dao.createClient(client);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the creation of client.` });
    }
});


//**** Get All User For Admin ****//
app.get('/api/clients', isLoggedIn, async (req, res) => {
    try {

        if (![1, 2].includes(req.user.accessType)) { //Manager and Employee
            return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
        }

        const result = await userDao.getUsersByAccessType(3);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
});

//**** Get User by UserID  ****//
app.get('/api/client/:userId', isLoggedIn, async (req, res) => {
    try {

        if (![1, 2].includes(req.user.accessType)) { //Manager and Employee
            return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
        }

        const result = await userDao.getUserById(req.params.userId);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
});




//**** Get Get Wallet Balance ****//
app.get('/api/clients/getWallet', isLoggedIn, async (req, res) => {
    try {
        const result = await userDao.getWalletBalance(req.user.id);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
});
//**** Get Get Wallet Balance ****//
app.get('/api/clients/riquredCharge', isLoggedIn, async (req, res) => {
    try {
        const result = await userDao.getRequiredCharge(req.user.id);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
});

//**** Get Get Wallet Balance For A booking with booking Id ****//
app.get('/api/clients/getRequiredChargeByBookingId', isLoggedIn, async (req, res) => {
    try {
        const result = await userDao.getRequiredChargeByBookingId(req.user.id, req.query.bookingId);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
});

//**** Put to update the wallet */
app.put('/api/topup/:userId/:amount', isLoggedIn, async (req, res) => {

    // you can also check here if the code passed in the URL matches with the code in req.body
    try {

        if (![1, 2].includes(req.user.accessType)) { //Manager and Employee
            return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
        }

        await userDao.topUpWallet(req.params.userId, req.params.amount);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of Survey.` });
    }

});



//****************************************************** */
//                Products API
//****************************************************** */
//Get All Products For All Users By paging
app.get('/api/products', async (req, res) => {
    try {
        const result = await productDao.getProducts(req.query.page ? req.query.page : 0);
        if (result.error)
            res.status(404).json(result);
        else {
            res.json(result);
        }
    } catch (err) {
        res.status(500).end();
    }
});

/*** Get products By EpiringDate ***/
app.get('/api/products/:date', async (req, res) => {
    try {

        let date = req.params.date;

        const result = await productDao.getProducts(date);
        if (result.error) {
            res.status(404).json(result);
        }
        else {

            res.json(result);
        }
    } catch (err) {
        res.status(500).end();
    }
})

//**** Get A Product By Id ****//
app.get('/api/products/:id', async (req, res) => {
    try {
        const result = await productDao.getProduct(req.params.id);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
});
/*** Get All Product Type ***/
app.get('/api/types', async (req, res) => {
    try {
        const result = await productDao.getTypes();
        if (result.error) {
            res.status(404).json(result);
        }
        else {
            res.json(result);
        }
    } catch (err) {
        res.status(500).end();
    }
});
/*** Get products By TypeId ***/
app.get('/api/products/type/:typeId/:date', async (req, res) => {
    try {

        const result = await productDao.getProductsByType(req.params.typeId, req.params.date);
        if (result.error) {
            res.status(404).json(result);
        }
        else {
            res.json(result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
})


/*** Get products By State and FarmerId ***/
app.get('/api/products/:farmerId/:state', isLoggedIn, async (req, res) => {

    if (![1, 4].includes(req.user.accessType)) { //Manager and Farmer
        return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
    }

    productDao.listFarmerProd(req.params.farmerId, req.params.state)
        .then(products => res.json(products))
        .catch(() => res.status(500).end());
});

// POST /api/product
app.post('/api/product',
    isLoggedIn, [
    check('Quantity').isInt({ min: 0, max: 10000 }),
    check('PricePerUnit').isFloat({ min: 0, max: 10000 })
], async (req, res) => {

    if (![1, 4].includes(req.user.accessType)) { //Manager and Farmer
        return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const product = {
        Id: req.body.Id,
        FarmerId: req.body.FarmerId,
        Name: req.body.Name,
        Description: req.body.Description,
        Quantity: req.body.Quantity,
        State: req.body.State,
        TypeId: req.body.TypeId,
        PricePerUnit: req.body.PricePerUnit,
        ExpiringDate: req.body.ExpiringDate
    };

    try {
        await productDao.createProduct(product);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the creation of product.` });
    }
});


app.put('/api/product/:Id', isLoggedIn,[
    check('Quantity').isInt({ min: 0, max: 10000 }),
    check('PricePerUnit').isFloat({ min: 0, max: 10000 })
], async (req, res) => {

    if (![1, 4].includes(req.user.accessType)) { //Manager and Farmer
        return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        await productDao.updateProduct(req.body.Quantity, req.params.Id, req.body.Name, req.body.Description, req.body.PricePerUnit, req.body.TypeId);
        res.status(200).end();
    }catch (err) {
        res.status(503).json({ error: `Database error during the update of Products.` });
    }

});


// PUT /api/product/<State>/<Id>
app.put('/api/product/:State/:Id', isLoggedIn, async (req, res) => {

    // you can also check here if the code passed in the URL matches with the code in req.body
    try {

        if (![1, 4].includes(req.user.accessType)) { //Manager and Farmer
            return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
        }

        await productDao.updateProductState(req.params.State, req.params.Id);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of Products.` });
    }

});

app.put('/api/notification/:Visibility/:Id', /* isLoggedIn, */ async (req, res) => {
    try {
        await Dao.updateNotificationVisibility(req.params.Visibility, req.params.Id);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of Notifications.` });
    }

});

// Upload Endpoint
app.post('/upload', isLoggedIn, (req, res) => {

    if (![1, 4].includes(req.user.accessType)) { //Manager and Farmer
        return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
    }

    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;

    file.mv(`${__dirname}/../client/public/ProductImages/${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.json({ fileName: file.name, filePath: `../ProductImages/${file.name}` });
    });
});

//****************************************************** */
//                Booking API
//****************************************************** */

//****   Get all bookings ****//
app.get('/api/bookings', isLoggedIn, async (req, res) => {
    try {

        if (![1, 2, 4, 5].includes(req.user.accessType)) { //Manager, Employee, Farmer, Deliverer
            return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
        }


        const result = await orderDao.getOrders();
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }

});

/*** Post Booking  ***/
app.post('/api/booking', isLoggedIn, [
    check('totalPrice').isDecimal(),
    check('state').isInt()
], async (req, res) => {

    if (![1, 2, 3].includes(req.user.accessType)) { //Manager, Employee, Client
        return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
    }

    const errors = validationResult(req);
    const fields = req.body.bookingStartDate.split(' ');
    const date = fields[0].split('-');
    const year = parseInt(date[0]);
    const month = parseInt(date[1]);
    const day = parseInt(date[2]);

    if (!dateRegexp.test(req.body.bookingStartDate) || (month === 2 && year % 4 !== 0 && day === 29)) {
        errors.errors = [...errors.errors, ({ value: req.body.bookingStartDate, msg: "Invalid value", param: "bookingStartDate", location: "body" })];
    }

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const booking = {
        bookingStartDate: req.body.bookingStartDate,
        totalPrice: req.body.totalPrice,
        state: req.body.state,
        userId: req.body.userId ? req.body.userId : req.user.id,
        pickupTime: req.body.pickupTime,
        deliveryTime: req.body.deliveryTime
    };
    var productsJson = req.body.products;
    JSON.stringify(productsJson);
    try {
        if (productsJson.length > 0) {
            var bookingId = await orderDao.createBooking(booking, req.body.userId);
            productsJson.forEach(function (element, index) {
                PostOrderProduct(element, bookingId);
            });
            return res.json(bookingId);
        }
        else {
            return res.status(500).json({ error: `The minimum number of  product in booking is 1 .` });
        }

    } catch (err) {
        return res.status(503).json({ error: `Database error during the creation of Booking.` });
    }
});

/*** Booking Post Products ***/
async function PostOrderProduct(element, bookingId) {
    const bookingProduct = {
        bookingId: bookingId,
        productId: element.productId,
        quantity: element.quantity,
        price: element.price,
    };
    await orderDao.createBookingAndProduct(bookingProduct);
    updateProductQUantity(element.quantity, element.productId);
}
/*** Update Product Quantity After Booking ***/
async function updateProductQUantity(quantity, productId) {
    await orderDao.updateProductQuantity(quantity, productId);
}

/*** Update Booking state With ID ***/
app.put('/api/bookings/:id', [
    check('state').isInt({ min: 0, max: 3 }),
], isLoggedIn, async (req, res) => {

    if (![1, 2, 4].includes(req.user.accessType)) { //Manager, Employee and Farmer
        return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
    }


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const state = req.body.state;
    // you can also check here if the code passed in the URL matches with the code in req.body
    try {
        await orderDao.updateBookingState(state, req.params.id);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of booking state ${req.params.id}.` });
    }

});
    

/*** Delete booking specified by the Id ***/

app.put('/api/deletebooking/:id', isLoggedIn, async (req, res) => {

    if (![1, 2, 4].includes(req.user.accessType)) { //Manager, Employee and Farmer
        return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
    }


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    // you can also check here if the code passed in the URL matches with the code in req.body
    try {
        await orderDao.deleteOrder(id);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the deletion of booking ${req.params.id}.` });
    }

});

app.put('/api/product/change-available-date/:Id', isLoggedIn, async (req, res) => {
    try {
        await productDao.updateAvailbeleDate(req.body.availableDate, req.body.Quantity, req.params.Id);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of Available Product.` });
    }

});

app.put('/api/productQuantity/:Id', isLoggedIn, [
    check('Quantity').isInt({ min: 0, max: 10000 }),
], async (req, res) => {

    if (![1, 4].includes(req.user.accessType)) { //Manager and Farmer
        return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        await productDao.updateProductQuantity(req.body.Quantity, req.body.Id);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of Available Product.` });
    }

});

app.delete('/api/deletebooking/:id', isLoggedIn, async (req, res) => {
    try {
        if (![1, 2, 3].includes(req.user.accessType)) { //Manager, Employee and Client
            return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
        }
        await orderDao.deleteOrder(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the deletion of order.` });
    }
});

//****************************************************** */
//                ProductImages API
//****************************************************** */

// POST /api/image
app.post('/api/image', isLoggedIn, async (req, res) => {
    const image = {
        id: req.body.id,
        path: req.body.path,
    };

    if (![1, 4].includes(req.user.accessType)) { //Manager and Farmer
        return res.status(403).json({ error: `Forbidden: User does not have necessary permissions for this resource.` });
    }

    try {
        await productDao.createImage(image);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the creation of image.` });
    }
});


app.get('/api/users/:id/bookings', async (req, res) => {
    try {
        const result = await orderDao.getOrdersByUserId(req.params.id);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }

});

app.get('/api/bookings/:id/products', async (req, res) => {
    try {
        const result = await orderDao.GetProductsFromBookingId(req.params.id);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }

});

/******************************************************
               BookingProducts Confimation
****************************************************** */
// After Update Available Product We Call This Url Wit Product Id
//localhost:3001/api/confirmBookingProduct/{ProductId}'
// After Update Available Product We Call This Url Wit Product Id
//localhost:3001/api/confirmBookingProduct/{ProductId}'
app.get('/api/confirmBookingProduct/:id', async (req, res) => {
    var productId = req.params.id;
    var farmerId = 0;
    var bookingId = 0;
    var quantity = 0;
    var pricePerUnit = 0;
    var userId = 0;
    var productName = "Title";
    console.log(productId)
    /*try {*/
        const product = await orderDao.GetProductInfoForConfirmation(productId);
        if (product.error)
            res.status(404).json(product);
        else {
            farmerId = product.FarmerId;
            productName = product.ProductName;
            pricePerUnit = product.PricePerUnit;
            quantity = product.Quantity;
            const bookingAndProducts = await orderDao.GetBookingProductsByProduct(productId);
            if (bookingAndProducts.length > 0) {
                bookingAndProducts.forEach(async element => {
                    console.log(element)
                    userId = element.UserId;
                    bookingId = element.BookingId;
                    if (element.Quantity <= quantity) {
                        quantity = quantity - element.Quantity;
                    }
                    else {
                        console.log("notification insert");
                        var prevQuantity = element.Quantity;
                        element.Quantity = quantity;
                        quantity = 0;
                        let header = "Change Booking#" + bookingId;
                        let body = "The quantity of " + productName + " has changed by Farmer from " + prevQuantity + " to " + element.Quantity;
                        await notificationDao.InsertNotification(userId, header, body, 1);
                        var priceDiff = (prevQuantity - element.Quantity)*pricePerUnit;
                        await orderDao.UpdateBookingTotalPrice(priceDiff, bookingId);
                    }
                    await orderDao.UpdateBookingProduct(quantity == null ? 0 : element.Quantity, pricePerUnit, bookingId, productId);
                    
                    //handling payment  for a booking from here
                    /*const user = await orderDao.GetUserById(userId);
                    const booking = await orderDao.GetBookingById(bookingId);
                    if( user.Wallet < booking.Paid + (element.Quantity * pricePerUnit) ){
                        //if user wallet as enough money, i get the payment and update paid field of booking
                        await userDao.decreaseWallet( user.Id, element.Quantity * pricePerUnit);
                        await orderDao.UpdateBookingPaid(element.Quantity * pricePerUnit, bookingId);
                    }
                    else{
                        //if wallet doesn't contain enough credits i must put order into state 1="pending for cancelation" and notify the user
                        await orderDao.updateBookingState(1, bookingId);
                        let header = "Not enough credits" + bookingId;
                        let body = "The credit in your wallet is insuficient to pay for: " + element.Quantity + productName + ". Please top up your wallet before Monday at 23.59 ";
                        await orderDao.InsertNotification(userId, header, body, 1);
                    }*/
                });
                // await sendEmailForChangeingBooking()
            }
            res.status(200).end();
            //res.json({ status: "Ok" });
        }
    /*}
    catch (err) {
      res.status(500).end();
    } */
});

/** confirmAllBookings: at 9am of monday a cronjob calls this api to receive payments for each booking having state = 0 = issued
 * if a booking with state 0 = "issued" is linked to a client having a
 *   wallet with credits > TotalPrice then decreases the wallet value and sets the booking state to 2 = "paid"
 * else if wallet with credits < "paid" then it sets the booking state to 1 = "pending cancelation"
 * (@todo change "paid" field in "toPay" into the Database)
 **/
app.get('/api/confirmAllBookings', async (req, res) => {
    
    try{

        let userBookings = await orderDao.getIssuedBookingsAndUsers();
        if (userBookings.length <= 0) { 
            console.log("no products with state 0=issued found in the db");
            res.status(404).end(); 
        }

        userBookings.forEach(async ub => {
            console.log("user "+ ub.UserId + ", booking "+ ub.BookingId);
            let wallet = ub.Wallet
            if(ub.TotalPrice <= ub.Wallet ){
                
                console.log("TotalPrice "+ ub.TotalPrice + ", Wallet = "+ wallet + "is enough");
                console.log("Removing "+ ub.TotalPrice + ", from Wallet");
                await userDao.decreaseWallet( ub.UserId, ub.TotalPrice );

                console.log("Update booking state to 2 = paid");
                await orderDao.updateBookingState(2, ub.BookingId);

                wallet = await userDao.getWalletBalance(ub.UserId);
                console.log("Wallet is now: " + wallet);

            }
            else{

                console.log("TotalPrice "+ ub.TotalPrice + ", Wallet = "+ wallet + "is NOT enough");

                console.log("Update booking state to 1 = pending cancelation");
                await orderDao.updateBookingState(1, ub.BookingId);
                
                console.log("Insert pending cancelation notification");
                let header = "Not enough credits";
                let body = "The credit in your wallet is insufficient to pay for your order #" + ub.BookingId + ". Please top up your wallet before Monday at 23.59 ";
                await notificationDao.InsertNotification(ub.UserId, header, body, 1);

            }
        });

        res.status(200).end();
    }
    catch (err) {
        res.status(500).end();
    }
});

/** confirmAllBookingsPendingCancelation: at 23.59am of monday a cronjob calls this api to process each booking having state = 1 = "pending cancelation"
 * if a booking with state 1 = "pending cancelation" is linked to a client having a
 *   wallet with credits > TotalPrice then decreases the wallet value and sets the booking state to 2 = "paid"
 * else if wallet with credits < "paid" then it sets the booking state to 4 = "canceled"
 * (@todo change "paid" field in "toPay" into the Database)
 **/
 app.get('/api/confirmAllBookingsPendingCancelation', async (req, res) => {
    
    try{

        let userBookings = await orderDao.getPendingCancelationBookingsAndUsers();
        if (userBookings.length <= 0) { 
            console.log("no products with state 1 = pending cancelation found in the db");
            res.status(404).end(); 
        }

        userBookings.forEach(async ub => {
            console.log("user "+ ub.UserId + ", booking "+ ub.BookingId);
            let wallet = ub.Wallet
            if(ub.TotalPrice <= ub.Wallet ){
                
                console.log("TotalPrice "+ ub.TotalPrice + ", Wallet = "+ wallet + "is enough");
                console.log("Removing "+ ub.TotalPrice + ", from Wallet");
                await userDao.decreaseWallet( ub.UserId, ub.TotalPrice );

                console.log("Update booking state to 2 = paid");
                await orderDao.updateBookingState(2, ub.BookingId);

                wallet = await userDao.getWalletBalance(ub.UserId);
                console.log("Wallet is now: " + wallet);

            }
            else{

                console.log("TotalPrice "+ ub.TotalPrice + ", Wallet = "+ wallet + "is NOT enough");

                console.log("Update booking state to 4 = canceled");
                await orderDao.updateBookingState(4, ub.BookingId);
                
                console.log("Insert canceled order notfications");
                let header = "Order canceled";
                let body = "The credit in your wallet is insufficient to pay for your order #" + ub.BookingId + ". The order has been canceled. ";
                await notificationDao.InsertNotification(ub.UserId, header, body, 1);

            }
        });

        res.status(200).end();
    }
    catch (err) {
        res.status(500).end();
    }
});

//We have to set this Url in Cron Docker
app.get('/api/send-mail-notifications', async (req, res) => {
    // async function sendEmailForChangeingBooking()
    // {
    const notifications = await notificationDao.getNotificationForChangedBooking();
    var createdMail = [];
    notifications.forEach(async element => {
        var filter = createdMail.filter(p => p.UserId == element.UserId);
        if (filter.length > 0) {
            filter[0].body = filter[0].body + "<div style='padding:20px;padding-top:20px;padding-bottm:20px;margin:10px;border:1px solid #e2e2e2;border-radius:10px'>" +
                "<h3>" + element.NotificationHeader + "</h3><p>" + element.NotificationBody + "</p></div>";
        }
        else
            createdMail.push({
                UserId: element.UserId, Email: element.Email, body: "<div style='padding:20px;padding-top:20px;padding-bottm:20px;margin:10px;border:1px solid #e2e2e2;border-radius:10px'>" +
                    "<p><h3>" + element.NotificationHeader + "</h3>" + element.NotificationBody + "</p></div>"
            })
        await notificationDao.UpdateNotificaton(element.NotificationId);
    });
    console.log(createdMail);
    createdMail.forEach(async element => {
        let info = await mailTransporter.sendMail({
            from: 'SPG P3 ES2<solidaritypurchasinggroup@gmail.com>', // sender address
            to: element.Email, // list of receivers
            subject: "Changed Order", // Subject line
            text: "Dear Client, Youre bookings have changed By", // plain text body
            html: "<h2>Dear Client, Your bookings have changed by farmers</h2>" + element.body
        });
        console.log("Message sent: %s", info.messageId);
    });
    // return;
    res.status(200).end();
    //res.json({ status: "Ok" });
});

app.get('/api/notifications', isLoggedIn, async (req, res) => {
    try {
        const result = await notificationDao.getNotificationsByUser(req.user.id);
        res.json(result);
    } catch (err) {
        res.status(500).end();
    }
})

/***********************************************
**------ Request Put For Update Booking By Client
Body : 
{
    "bookingId":7,
    "deliveryTime":"2021-11-12",
    "products":[
        {
            "productId":1,
            "quantity":3

        }
    ]
}
1- Get and mathch userId for cheking order is for current user or not
2- Get price unit for all BookingAndProduct and update all
3- Update booking
*/
app.put('/api/bookingUpdateByClient/:id', isLoggedIn, async (req, res) => {
    try {
        var bookingId=req.body.BookingId;       
        var deliveryTime=req.body.DeliveryTime;       
        var totalSum=0;
        var userId=req.body.UserId;        
        const products= await orderDao.GetProductsFromBookingId(bookingId);       
        if (req.user.id==userId){
        products.forEach(async element => {
          var productId=element.ProductId;
          var pricePerUnit= element.PricePerUnit;
          var quantity=element.Qty;
          totalSum +=(quantity*pricePerUnit);
          await orderDao.UpdateBookingProduct(quantity,pricePerUnit,bookingId,productId);
        });
        var lastUpdate= await orderDao.UpdateBookingByClient(bookingId,deliveryTime,totalSum);
        res.json(lastUpdate);
    }
    else
        res.status(503).json({ error: `This order is not match for you` });

    } catch (err) {
        res.status(500).end();
    }
    
})

// Activate the server
// Comment this app.listen function when testing
/*
app.listen(port, () => {
    console.log(`react-score-server listening at http://localhost:${port}`);
});*/

module.exports = app
