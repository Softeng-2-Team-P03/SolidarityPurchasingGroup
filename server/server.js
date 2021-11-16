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
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

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
        req.login(user, (err) => {
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
        const result = await userDao.getUsersByAccessType(3);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
    //console.log(res);
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
        console.log(err)
        res.status(500).end();
    }
});
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
/*** Get Oroducts By TypeId ***/
app.get('/api/products/type/:typeId', async (req, res) => {
    try {
        const result = await productDao.getProductsByType(req.params.typeId);
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

//****************************************************** */
//                Booking API
//****************************************************** */
/*** Post Booking  ***/
app.post('/api/booking', isLoggedIn, [
    check('bookingStartDate').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
    check('totalPrice').isDecimal(),
    check('state').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const booking = {
        bookingStartDate: req.body.bookingStartDate,
        totalPrice: req.body.totalPrice,
        state: req.body.state,
        userId: req.body.userId ? req.body.userId : req.user.id
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

/*** Get Booking With ID ***/
app.put('/api/bookings/:id', [
    check('state').isInt({ min: 0, max: 2 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const state = req.body.state;
    // you can also check here if the code passed in the URL matches with the code in req.body
    try {
        await orderDao.updateBookingState(state, req.params.id);
        //res.status(200).end();
        setTimeout(() => res.status(200).end(), 2000);
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of booking state ${req.params.id}.` });
    }

});



// Activate the server
app.listen(port, () => {
    console.log(`react-score-server listening at http://localhost:${port}`);
});
