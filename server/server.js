'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
// const PDao = require('./product-dao'); // module for accessing the exams in the DB
const productDao = require('./product-dao');
const orderDao = require('./order-dao');

const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
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


/*** APIs ***/

// //GET /api/product
// app.get('/api/products', async (req, res) => {
//     PDao.getProducts()
//         .then(products => res.json(products))
//         .catch(() => res.status(500).end());
// });


//**** Api: Get All User For Admin ****//
app.get('/api/users', isLoggedIn, async (req, res) => {
    try {
        const result = await userDao.getUsers(req.query.page);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
    console.log(res);
});

//**** Api: Get All Products For All Users By paging ****//
app.get('/api/products', async (req, res) => {
    try {
        const result = await productDao.getProducts(req.query.page ? req.query.page : 0);
        if (result.error)
            res.status(404).json(result);
        else {
            console.log(res.json(result));

            res.json(result);
        }
    } catch (err) {
        res.status(500).end();
    }
    console.log(res);
});
//**** Api: Get Details Of A Products For All Users ****//
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
// Order

// ,isLoggedIn
app.post('/api/booking', [
    check('bookingStartDate').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
    check('totalPrice').isDecimal(),
    check('state').isInt(),
    check('pickupTime').isDate({ format: 'YYYY-MM-DD', strictMode: true })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const booking = {
        bookingStartDate: req.body.bookingStartDate,
        totalPrice: req.body.totalPrice,
        state: req.body.state,
        pickupTime: req.body.pickupTime,
        deliveryTime: req.body.deliveryTIme,
        userId: req.body.userId ? req.body.userId : 1 // : req.user.id
    };
    console.log(booking)
    var productsJson = req.body.products;
    JSON.stringify(productsJson);
    try {
        if (productsJson.length > 0) {
            var bookingId = await orderDao.createBooking(booking, req.body.userId);
            productsJson.forEach(function (element, index) {
                PostOrderProduct(element, bookingId);
            });

           return res.json(productsJson);
        }
        else {
            return res.status(503).json({ error: `The minimum number of  product in booking is 1 .` });
        }

    } catch (err) {
        return res.status(503).json({ error: `Database error during the creation of Booking.` });
    }
});


async function PostOrderProduct(element, bookingId) {
    console.log('calling');
    const bookingProduct = {
        bookingId: bookingId,
        productId: element.productId,
        quantity: element.quantity,
        price: element.price,
    };
    var bookingProductIdId = await orderDao.createBookingAndProduct(bookingProduct);

    // expected output: "resolved"
}

// Activate the server
app.listen(port, () => {
    console.log(`react-score-server listening at http://localhost:${port}`);
});
