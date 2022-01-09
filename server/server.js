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

/* import for cronjobs */
var cron = require('node-cron');

const bodyParser = require('body-parser')
//---------------------------------------------------
//    import For Telegram 
// --------------------------------------------------
require('dotenv').config()
const telegramDao = require('./telegram/dao.js');
const axios = require('axios')
const { Telegraf, Markup, Telegram } = require('telegraf');
const { telegrafThrottler } = require('telegraf-throttler');
const { TOKEN, SERVER_URL } = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI
const bot = new Telegraf(TOKEN);
const throttler = telegrafThrottler();
bot.use(throttler);
const bcrypt = require('bcrypt');
// const telegram = require('./telegram/index');

//--------------------------------------------------


const dateRegexp = new RegExp(/^(([1]|[2])\d{3})-((0[13578]|1[02])-(0[0-9]|[1-2][0-9]|3[0-1])|(0[469]|11)-(0[0-9]|[1-2][0-9]|30)|(02)-(0[0-9]|[1-2][0-9]))([ ])([01][0-9]|2[0-3])(\:)([0-5][0-9])(\:)([0-5][0-9])$/);
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
app.use(bodyParser.json())

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());
// Telegram

/*
const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
    console.log(res.data)
}*/

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

function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}


/*---------------------------------- */
/*           API SECTION             */
/*---------------------------------- */

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
    check('accessType').notEmpty(),
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
app.get('/api/client/:userId', isLoggedIn, [check('userId').isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
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
app.get('/api/clients/:id/getWallet', isLoggedIn, [check('id').isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const result = await userDao.getWalletBalance(req.params.id);
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
app.put('/api/topup/:userId/:amount', isLoggedIn, [check('userId').isInt(), check('amount').isFloat()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

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

/*** Get products By ExpiringDate ***/
app.get('/api/products/:date', async (req, res) => {
    try {

        let date = req.params.date;
        if (!isValidDate(date))
            res.status(422).end();
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
app.get('/api/products/:id', [check('id').isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
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
app.get('/api/products/type/:typeId/:date', [check('typeId').isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        if (!isValidDate(req.params.date))
            res.status(422).end();
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
app.get('/api/products/:farmerId/:state', isLoggedIn, [check('farmerId').isInt(), check('state').isInt({ min: 0, max: 2 })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

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
    check('FarmerId').notEmpty(),
    check('Name').notEmpty(),
    check('Description').notEmpty(),
    check('State').notEmpty(),
    check('TypeId').notEmpty(),
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
        console.log(err);
        res.status(503).json({ error: `Database error during the creation of product.` });
    }
});


app.put('/api/product/:Id', isLoggedIn, [
    check(['Id']).isInt(),
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
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of Products.` });
    }

});


// PUT /api/product/<State>/<Id>
app.put('/api/product/:State/:Id', isLoggedIn, [check('State').isInt({ min: 0, max: 2 }), check(['Id']).isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

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
    if (isNaN(req.params.Visibility) || isNaN(req.params.Id))
        res.status(503).end();
    try {
        await Dao.updateNotificationVisibility(req.params.Visibility, req.params.Id);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of Notifications.` });
    }
});

app.post('/api/notification', [
    check('userId').notEmpty().isInt(),
    check('body').notEmpty(),
    check('header').notEmpty(),
    check('type').isInt({ min: 0, max: 2 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        await notificationDao.InsertNotification(req.body.userId, req.body.header, req.body.body, req.body.type);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of Products.` });
    }

})

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
        console.log({ errors: errors.array() })
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
        console.log(err);
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
    check('id').isInt(),
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

app.put('/api/deletebooking/:id', isLoggedIn, [check(['id']).isInt()], async (req, res) => {

    if (![1, 2].includes(req.user.accessType)) { //Manager, Employee
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

app.put('/api/product/change-available-date/:Id', isLoggedIn, [check(['Id']).isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        await productDao.updateAvailbeleDate(req.body.availableDate, req.body.Quantity, req.params.Id);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of Available Product.` });
    }

});

app.put('/api/productQuantity/:Id', isLoggedIn, [
    check(['Id']).isInt(),
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

app.delete('/api/deletebooking/:id', isLoggedIn, [check(['id']).isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
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
app.post('/api/image', isLoggedIn, [check(['id']).isInt(), check('path').notEmpty()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
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


app.get('/api/users/:id/bookings', [check(['id']).isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
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

app.get('/api/bookings/:id/products', [check(['id']).isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
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
    if (isNaN(req.params.id))
        return res.status(422).end();

    var productId = req.params.id;
    var farmerId = 0;
    var bookingId = 0;
    var quantity = 0;
    var soldQuantity = 0;
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
        soldQuantity = product.SoldQuantity;

        //updating SoldQuantity if it is greater than the quantity confirmed by the farmer
        if (soldQuantity > quantity) {
            productDao.updateProductSoldQuantity(quantity, productId);
        }

        const bookingAndProducts = await orderDao.GetBookingProductsByProduct(productId);
        if (bookingAndProducts.length > 0) {
            //bookingAndProducts.forEach(async element => {
            for (const element of bookingAndProducts) {
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
                    var priceDiff = (prevQuantity - element.Quantity) * pricePerUnit;
                    await orderDao.UpdateBookingTotalPrice(priceDiff, bookingId);
                }
                await orderDao.UpdateBookingProduct(quantity == null ? 0 : element.Quantity, pricePerUnit, bookingId, productId);
            }
        }
        res.status(200).end();
    }
    res.status(200).end();
    //res.json({ status: "Ok" });
}
    /*}
    catch (err) {
      res.status(500).end();
    } */
);

/** confirmAllBookings: at 9am of monday a cronjob calls this api to receive payments for each booking having state = 0 = issued
 * if a booking with state 0 = "issued" is linked to a client having a
 *   wallet with credits > TotalPrice then decreases the wallet value and sets the booking state to 2 = "paid"
 * else if wallet with credits < "paid" then it sets the booking state to 1 = "pending cancelation"
 * (@todo change "paid" field in "toPay" into the Database)
 **/
app.get('/api/confirmAllBookings', async (req, res) => {

    try {

        let userBookings = await orderDao.getIssuedBookingsAndUsers();
        if (userBookings.length <= 0) {
            console.log("no products with state 0=issued found in the db");
            res.status(404).end();
        }

        //userBookings.forEach(async ub => {
        for (const ub of userBookings) {
            console.log("user " + ub.UserId + ", booking " + ub.BookingId);
            let wallet = await userDao.getWalletBalance(ub.UserId);
            console.log("user wallet is:  " + wallet);
            //let wallet = ub.Wallet;
            if (ub.TotalPrice <= wallet) {

                console.log("TotalPrice " + ub.TotalPrice + ", Wallet = " + wallet + "is enough");
                console.log("Removing " + ub.TotalPrice + ", from Wallet");
                await userDao.decreaseWallet(ub.UserId, ub.TotalPrice);
                wallet = wallet - ub.TotalPrice;
                //wallet = await userDao.getWalletBalance(ub.UserId);
                console.log("Wallet is now: " + wallet);

                console.log("Update booking state to 2 = paid");
                await orderDao.updateBookingState(2, ub.BookingId);

            }
            else {

                console.log("TotalPrice " + ub.TotalPrice + ", Wallet = " + wallet + "is NOT enough");

                console.log("Update booking state to 1 = pending cancelation");
                await orderDao.updateBookingState(1, ub.BookingId);

                console.log("Insert pending cancelation notification");
                let header = "Not enough credits";
                let body = "The credit in your wallet is insufficient to pay for your order #" + ub.BookingId + ". Please top up your wallet before Monday at 23.59 ";
                await notificationDao.InsertNotification(ub.UserId, header, body, 1);

            }
        }

        res.status(200).end();
    }
    catch (err) {
        res.status(500).end();
    }
});

/** CRONJOB OF confirmAllBookings **/
cron.schedule('0 9 * * 1', async () => {
    console.log('Running the confirmAllBookings cronjob on Monday at 09:00 at Europe/Rome timezone');

    try {

        let userBookings = await orderDao.getIssuedBookingsAndUsers();
        if (userBookings.length <= 0) {
            console.log("no products with state 0=issued found in the db");
            console.log("The cronjob confirmAllBookingsPendingCancelation ended with status 404 - Not Found");
        }

        //userBookings.forEach(async ub => {
        for (const ub of userBookings) {
            console.log("user " + ub.UserId + ", booking " + ub.BookingId);
            let wallet = await userDao.getWalletBalance(ub.UserId);
            console.log("user wallet is:  " + wallet);
            //let wallet = ub.Wallet;
            if (ub.TotalPrice <= wallet) {

                console.log("TotalPrice " + ub.TotalPrice + ", Wallet = " + wallet + "is enough");
                console.log("Removing " + ub.TotalPrice + ", from Wallet");
                await userDao.decreaseWallet(ub.UserId, ub.TotalPrice);
                wallet = wallet - ub.TotalPrice;
                //wallet = await userDao.getWalletBalance(ub.UserId);
                console.log("Wallet is now: " + wallet);

                console.log("Update booking state to 2 = paid");
                await orderDao.updateBookingState(2, ub.BookingId);

            }
            else {

                console.log("TotalPrice " + ub.TotalPrice + ", Wallet = " + wallet + "is NOT enough");

                console.log("Update booking state to 1 = pending cancelation");
                await orderDao.updateBookingState(1, ub.BookingId);

                console.log("Insert pending cancelation notification");
                let header = "Not enough credits";
                let body = "The credit in your wallet is insufficient to pay for your order #" + ub.BookingId + ". Please top up your wallet before Monday at 23.59 ";
                await notificationDao.InsertNotification(ub.UserId, header, body, 1);

            }
        }
        console.log("The cronjob confirmAllBookings ended with status 200 - OK");
        //res.status(200).end();
    }
    catch (err) {
        console.log("The cronjob confirmAllBookings ended with status 500 - Internal server error");
        //res.status(500).end();
    }

}, {
    scheduled: true,
    timezone: "Europe/Rome"
});

/** confirmAllBookingsPendingCancelation: at 23.59am of monday a cronjob calls this api to process each booking having state = 1 = "pending cancelation"
 * if a booking with state 1 = "pending cancelation" is linked to a client having a
 *   wallet with credits > TotalPrice then decreases the wallet value and sets the booking state to 2 = "paid"
 * else if wallet with credits < "paid" then it sets the booking state to 4 = "canceled"
 * (@todo change "paid" field in "toPay" into the Database)
 **/
app.get('/api/confirmAllBookingsPendingCancelation', async (req, res) => {

    try {

        let userBookings = await orderDao.getPendingCancelationBookingsAndUsers();
        if (userBookings.length <= 0) {
            console.log("no products with state 1 = pending cancelation found in the db");
            res.status(404).end();
        }

        //userBookings.forEach(async ub => {

        for (const ub of userBookings) {
            console.log("user " + ub.UserId + ", booking " + ub.BookingId);
            let wallet = await userDao.getWalletBalance(ub.UserId);
            console.log("user wallet is:  " + wallet);
            if (ub.TotalPrice <= wallet) {

                console.log("TotalPrice " + ub.TotalPrice + ", Wallet = " + wallet + "is enough");
                console.log("Removing " + ub.TotalPrice + ", from Wallet");
                await userDao.decreaseWallet(ub.UserId, ub.TotalPrice);
                wallet = wallet - ub.TotalPrice;
                //wallet = await userDao.getWalletBalance(ub.UserId);
                console.log("Wallet is now: " + wallet);

                console.log("Update booking state to 2 = paid");
                await orderDao.updateBookingState(2, ub.BookingId);

            }
            else {

                console.log("TotalPrice " + ub.TotalPrice + ", Wallet = " + wallet + "is NOT enough");

                console.log("Update booking state to 4 = canceled");
                await orderDao.updateBookingState(4, ub.BookingId);

                console.log("Insert canceled order notfications");
                let header = "Order canceled";
                let body = "The credit in your wallet is insufficient to pay for your order #" + ub.BookingId + ". The order has been canceled. ";
                await notificationDao.InsertNotification(ub.UserId, header, body, 1);

            }
        };

        res.status(200).end();
    }
    catch (err) {
        res.status(500).end();
    }
});


/** CRONJOB OF confirmAllBookingsPendingCancelation **/
cron.schedule('59 23 * * 1', async () => {
    console.log('Running the confirmAllBookingsPendingCancelation cronjob on Monday at 23:59 at Europe/Rome timezone');
    try {

        let userBookings = await orderDao.getPendingCancelationBookingsAndUsers();
        if (userBookings.length <= 0) {
            console.log("no products with state 1 = pending cancelation found in the db");
            //res.status(404).end();
            console.log("The cronjob confirmAllBookingsPendingCancelation ended with status 404 - Not Found");
        }

        //userBookings.forEach(async ub => {

        for (const ub of userBookings) {
            console.log("user " + ub.UserId + ", booking " + ub.BookingId);
            let wallet = await userDao.getWalletBalance(ub.UserId);
            console.log("user wallet is:  " + wallet);
            if (ub.TotalPrice <= wallet) {

                console.log("TotalPrice " + ub.TotalPrice + ", Wallet = " + wallet + "is enough");
                console.log("Removing " + ub.TotalPrice + ", from Wallet");
                await userDao.decreaseWallet(ub.UserId, ub.TotalPrice);
                wallet = wallet - ub.TotalPrice;
                //wallet = await userDao.getWalletBalance(ub.UserId);
                console.log("Wallet is now: " + wallet);

                console.log("Update booking state to 2 = paid");
                await orderDao.updateBookingState(2, ub.BookingId);

            }
            else {

                console.log("TotalPrice " + ub.TotalPrice + ", Wallet = " + wallet + "is NOT enough");

                console.log("Update booking state to 4 = canceled");
                await orderDao.updateBookingState(4, ub.BookingId);

                console.log("Insert canceled order notfications");
                let header = "Order canceled";
                let body = "The credit in your wallet is insufficient to pay for your order #" + ub.BookingId + ". The order has been canceled. ";
                await notificationDao.InsertNotification(ub.UserId, header, body, 1);

            }
        };

        console.log("The cronjob confirmAllBookingsPendingCancelation ended with status 200 - OK");
        //res.status(200).end();
    }
    catch (err) {
        console.log("The cronjob confirmAllBookings ended with status 500 - Internal server error");
        //res.status(500).end();
    }
}, {
    scheduled: true,
    timezone: "Europe/Rome"
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

/** CRONJOB OF send-mail-notifications **/
cron.schedule('5 9 * * 1', async () => {
    console.log('Running the send-mail-notifications cronjob on Monday at 09:05 at Europe/Rome timezone');
    try {
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
        console.log("The cronjob confirmAllBookingsPendingCancelation ended with status 200 - OK");
        //res.status(200).end();
    }
    catch (err) {
        console.log("The cronjob confirmAllBookings ended with status 500 - Internal server error");
        //res.status(500).end();
    }
}, {
    scheduled: true,
    timezone: "Europe/Rome"
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
app.put('/api/bookingUpdateByClient/:id', isLoggedIn, [check('id').isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        var bookingId = req.body.BookingId;
        var deliveryTime = req.body.DeliveryTime;
        var pickupTime = req.body.PickupTime;
        var totalSum = req.body.totalPrice;
        var userId = req.body.userId;
        await orderDao.DeleteBookingProduct(bookingId);



        if (req.user.id == userId) {
            req.body.products.forEach(async element => {
                var productId = element.productId;
                var pricePerUnit = await productDao.getProductPriceUnit(productId);
                var quantity = element.quantity;
                await orderDao.UpdateBookingProduct(quantity, pricePerUnit, bookingId, productId);
            });
            var lastUpdate = await orderDao.UpdateBookingByClient(bookingId, deliveryTime, pickupTime, totalSum);
            res.json(lastUpdate);
        }
        else
            res.status(503).json({ error: `This order is not match for you` });

    } catch (err) {
        res.status(500).end();
    }

})



app.post('/api/unretrievedfood', check('date').isDate({ format: 'YYYY-MM-DD', strictMode: true }), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })

    };
    try {
        const numBookings = await orderDao.setBookingUnretrieved(req.body.date);
        if(numBookings === 0){
            res.status(204).end();
        }
        const count = await orderDao.GetCountUnretrievedBookingsByUser();
        if (count.error)
            res.status(404).json(result);
        else{
            var header = "Frequent missed pickups";
            var body = "You will be suspended at the 5th cumulative missed pickup";
            count.forEach(async user => {   
                var UserId = user.UserId;         
                await notificationDao.InsertNotification(UserId, header, body, 2);
            })            
        }
       
        const result = await orderDao.GetUnretrievedBookings(); 

      
        if (result.error)
            res.status(404).json(result);
        else {
                result.forEach(async product => {          
              
                var ProductId = product.ProductId;
                var ProductQty = product.ProductQty;
                var TypeId = product.TypeId;
                await orderDao.createUnretrieved(req.body.date, ProductId, ProductQty, TypeId);
                console.log("ciAo");


            })
           
           

           

            res.status(201).end();

        }

    } catch (err) {
        res.status(503).json({ error: `Database error during the creation of unretrieved food.` });
    }
});




/**
 * Gets unretrieved food of a certain week passed to the api through an iso date yyyy-mm-dd in the body of the call
 * The date should indicate the Saturday of the week we want to select since all unretrieved products are recorded 
 * within the unretrievedFood table with the associated Saturday of the week they were intended to be picked up.
 * CALL: /api/unretrievedFoodOfWeek?date=YYYY-MM-DD
 */
app.get('/api/unretrievedFoodOfWeek', [check('date').isDate({ format: 'YYYY-MM-DD', strictMode: true })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const d = new Date(req.query.date);
    if (d.getDay() != 6) {
        console.log("The date selected doesn't indicate a saturday, pass the saturday of the selected week in the body of the http call.");
        res.status(403).end();
    }

    try {
        const result = await orderDao.getUnretrievedFoodByWeek(req.query.date);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }

});


/**
 * Gets unretrieved food of a certain month passed to the api through the values monthNum (1= janauary, 12=december) and year (between 1970 and 2999)
 * CALL: /api/unretrievedFoodOfMonth?monthNum=11&year=2021
 */
app.get('/api/unretrievedFoodOfMonth', [check('monthNum').isInt({ min: 1, max: 12 }), check('year').isInt({ min: 1970, max: 2999 })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }


    try {
        const result = await orderDao.getUnretrievedFoodByMonth(req.query.monthNum, req.query.year);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }

});

/**
 * Gets unretrieved food of a certain product whose productId is passed to the api
 */
app.get('/api/unretrievedFoodByProductId/:id', [check('id').isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }


    try {
        const result = await orderDao.getUnretrievedFoodByProductId(req.params.id);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }

});

/**
 * Gets unretrieved food of a certain product type specified in the api
 */
app.get('/api/unretrievedFoodByProductType/:type', [check('type').isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const result = await orderDao.getUnretrievedFoodByProductType(req.params.type);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }

});



//------------------------------------------------------------
//   Telegram Part
//------------------------------------------------------------
/* Table Telegram
CREATE TABLE "Telegram" (
    "ChatId"	TEXT,
    "Mobile"	TEXT,
    "HashedPassword"	TEXT,
    "Username"	TEXT,
    "SuccessLogin"	REAL DEFAULT 0
);
Notifications:
Add Column
"TelegramStatus"	INTEGER DEFAULT 0,
*/
bot.command('quit', (ctx) => {
    ctx.telegram.leaveChat(ctx.message.chat.id)
    ctx.leaveChat()
})

// Start Bot Initialize Mobile
bot.start(async (ctx) => {
    await telegramDao.InsertChatId(ctx.message.chat.id, ctx.message.from.username);
    ctx.reply(`Dear ${ctx.message.from.username} Welcome to Solidary Shopings`)
    ctx.reply(`📲 Please send your phone number`)
})
// Start Command Reset Bot 
bot.command('start', async (ctx) => {
    await telegramDao.InsertChatId(ctx.message.chat.id, ctx.message.from.username);
    ctx.reply(`Dear ${ctx.message.from.username} Welcome to Solidary Shopings`)
    ctx.reply(`📲 Please send your phone number`)
})

// Check Wallet Balance (non è  Cpompletto)
bot.command('wallet', async (ctx) => {
    if (await checkAuthBot(ctx.message.chat.id)) {
        ctx.reply(`OK`)
    }
    else
        ctx.reply(`Authentication Faild!!!`)
})

// Send All Notification With Command: /notifications 
bot.command('notifications', async (ctx) => {
    if (checkAuthBot(ctx.message.chat.id)) {
        console.log("Notification command execution");
        var mobile = await telegramDao.getMobile(ctx.message.chat.id);
        if (mobile != null) {
            var results = await telegramDao.listOfNotifications(mobile);
            console.log(results);
            if (results.length > 0) {
                for (var x = 0; x < results.length; x++) {
                    ctx.reply(results[x].NotificationBody);
                    await telegramDao.UpdateNotificatonStatusForTelgram(results[x].NotificationId);
                }
            }
            else
                ctx.reply("Notification not found ");
        }
    }
    else
        ctx.reply(`Authentication Faild!!!`)
    return

})
//API Send All Notification Of All User To Set In Docker 
app.get('/api/SendNotificationForUsers', async (req, res) => {
    const telegramx = new Telegram(process.env.TOKEN);
    var results = await telegramDao.getAllNotifications();
    console.log(results);
    for (var x = 0; x < results.length; x++) {
        telegramx.sendMessage(
            results[x].ChatId,
            results[x].NotificationBody
        );
        await telegramDao.UpdateNotificatonStatusForTelgram(results[x].NotificationId);
    }
    res.status(200).end();
});



/** CRONJOB to send telegram notification of new products available for purchase on Saturday **/
cron.schedule('* 9 * * 6', async () => {

    try {
        const telegramx = new Telegram(process.env.TOKEN);
        var results = await telegramDao.getAllChatId();
        for (var x = 0; x < results.length; x++) {
            await sleep(1000);
            console.log("Sending notification to: " + results[x].ChatId);
            telegramx.sendMessage(
                results[x].ChatId,
                "Products are available for purchase on the shop! You sure want to check them out!\n"
            );
        }
        telegramx.close();
        res.status(200).end();

    }
    catch (err) {
        console.log("The cronjob confirmAllBookings ended with status 500 - Internal server error");
        //res.status(500).end();
    }
}, {
    scheduled: true,
    timezone: "Europe/Rome"
});



function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

//API send telegram notification of new products available
app.get('/api/SNForAvailableProducts', async (req, res) => {

    try {
        const telegramx = new Telegram(process.env.TOKEN);
        var results = await telegramDao.getAllChatId();
        console.log(results);
        for (var x = 0; x < results.length; x++) {
            await sleep(2000);
            console.log(results[x].ChatId);
            telegramx.sendMessage(
                results[x].ChatId,
                "There are new products that you can see on the site\n"
            );
        }
        telegramx.close();
        res.status(200).end();
    }
    catch (err) {
        console.log("The API SNForAvailableProducts ended with status 500 - Internal server error");
        console.log(err);
        //res.status(500).end();
    }
});

//Check And Controll The Other Command Send From Telegram
bot.on('text', async (ctx) => {
    console.log(ctx.message.text)
    if (ctx.message.text.length == 10) {
        var x = await telegramDao.updateMobile(ctx.message.text, ctx.message.chat.id)
        ctx.reply(`Your number is saved, to change it you can repeat this procedure using again the command /start`);
        ctx.replyWithHTML(`Now send your password to connect to your Solidarity Purchasing Group account, attention: send your password with this template:\n` +
            `<b>my password: mnbvcxz</b>`);
        return
    }

    if (ctx.message.text.split(":")[0] === "my password") {
        var mobile = await telegramDao.getMobile(ctx.message.chat.id);
        if (mobile != null) {
            var resualt = await telegramDao.updateSuccessLogin(mobile, ctx.message.text.split(": ")[1]);
            if (!resualt)
                ctx.reply(`The password was wrong! Please try again`);
            else
                ctx.reply(`The login was successful`);
            return x;
        }
        else {
            ctx.reply(`📲 Please send your phone number first!`)
            return
        }
    }
    ctx.reply(`Wrong input format or command. If you are searching for a command, the command menu is a valid option.`)
})

//Control user login ws successfull
async function checkAuthBot(chatId) {
    {
        var mobile = await telegramDao.getMobile(chatId);
        if (mobile != null) {
            var info = await telegramDao.checkAuth(chatId);
            return info == 1 ? true : false;
        }
        else
            return false;
    }
}
app.post('/api/telegnotification', async (req, res) => {
    console.log("login telegram");
    await telegrmDao.authenticateTelegramBot(req.body.mobile, req.body.pass);
});

//bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


// Activate the server
// Comment this app.listen function when testing
app.listen(port, () => {
    console.log(`react-score-server listening at http://localhost:${port}`);
});

module.exports = app
