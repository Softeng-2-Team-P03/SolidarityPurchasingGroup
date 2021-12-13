const express = require('express');
const app = require("../server");
const supertest = require("supertest");
const server = supertest.agent(app);

// This passes because 1 === 1
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

function loginUser(accessType) {
    let credentials = { username: "federico@spg.com", password: "26gKpQK9" } //default is client
    if (accessType === 1) {
        credentials = { username: "luca@spg.com", password: "FgKECe4w" }
    }
    if (accessType === 2) {
        credentials = { username: "clodia@spg.com", password: "Mnbvcxz1234" }
    }
    if (accessType === 3) {
        credentials = { username: "federico@spg.com", password: "26gKpQK9" }
    }
    if (accessType === 4) {
        credentials = { username: "paolo@spg.com", password: "eGB2VrUe" }
    }
    if (accessType === 5) {
        credentials = { username: "simone@spg.com", password: "+r[xe=kWpQ'4.2fT" }
    }

    return new Promise((resolve, reject) => {
        server
            .post('/api/sessions')
            .send(credentials)
            .expect(200)
            .then((user) => resolve(user))
            .catch(err => reject(err))
    });
}

function logoutUser() {
    return new Promise((resolve, reject) => {
        server
            .delete('/api/sessions/current')
            .expect(200)
            .then(() => resolve(null))
            .catch(err => reject(err))
    })
}

describe("Logins and Logout", () => {
    beforeAll(() => logoutUser());

    it("login as manager", function (done) {
        loginUser(1)
            .then((user) => {
                expect(user.body.id).toBe(1);
                expect(user.body.username).toBe("luca@spg.com");
                expect(user.body.name).toBe("Luca");
                expect(user.body.accessType).toBe(1);
                done();
            })
            .catch(err => done(err))
    });

    it("check if manager still logged in", function (done) {
        server
            .get('/api/sessions/current')
            .expect(200)
            .then((user) => {
                expect(user.body.id).toBe(1);
                expect(user.body.username).toBe("luca@spg.com");
                expect(user.body.name).toBe("Luca");
                expect(user.body.accessType).toBe(1);
                done();
            })
            .catch(err => done(err))
    })

    it("login as employee", function (done) {
        loginUser(2)
            .then((user) => {
                expect(user.body.id).toBe(11);
                expect(user.body.username).toBe("clodia@spg.com");
                expect(user.body.name).toBe("Clodia");
                expect(user.body.accessType).toBe(2);
                done();
            })
            .catch(err => done(err))
    });

    it("check if employee still logged in", function (done) {
        server
            .get('/api/sessions/current')
            .expect(200)
            .then((user) => {
                expect(user.body.id).toBe(11);
                expect(user.body.username).toBe("clodia@spg.com");
                expect(user.body.name).toBe("Clodia");
                expect(user.body.accessType).toBe(2);
                done();
            })
            .catch(err => done(err))
    })

    it("login as client", function (done) {
        loginUser(3)
            .then((user) => {
                expect(user.body.id).toBe(3);
                expect(user.body.username).toBe("federico@spg.com");
                expect(user.body.name).toBe("Ferderico");
                expect(user.body.accessType).toBe(3);
                done();
            })
            .catch(err => done(err))
    });

    it("check if client still logged in", function (done) {
        server
            .get('/api/sessions/current')
            .expect(200)
            .then((user) => {
                expect(user.body.id).toBe(3);
                expect(user.body.username).toBe("federico@spg.com");
                expect(user.body.name).toBe("Ferderico");
                expect(user.body.accessType).toBe(3);
                done();
            })
            .catch(err => done(err))
    })

    it("login as farmer", function (done) {
        loginUser(4)
            .then((user) => {
                expect(user.body.id).toBe(4);
                expect(user.body.username).toBe("paolo@spg.com");
                expect(user.body.name).toBe("Paolo");
                expect(user.body.accessType).toBe(4);
                done()
            })
            .catch(err => done(err))
    })

    it("check if farmer still logged in", function (done) {
        server
            .get('/api/sessions/current')
            .expect(200)
            .then((user) => {
                expect(user.body.id).toBe(4);
                expect(user.body.username).toBe("paolo@spg.com");
                expect(user.body.name).toBe("Paolo");
                expect(user.body.accessType).toBe(4);
                done()
            })
            .catch(err => done(err))
    })

    it("login as deliverer", function (done) {
        loginUser(5)
            .then((user) => {
                expect(user.body.id).toBe(10);
                expect(user.body.username).toBe("simone@spg.com");
                expect(user.body.name).toBe("Simone");
                expect(user.body.accessType).toBe(5);
                done()
            })
            .catch(err => done(err))
    })

    it("check if deliverer still logged in", function (done) {
        server
            .get('/api/sessions/current')
            .expect(200)
            .then((user) => {
                expect(user.body.id).toBe(10);
                expect(user.body.username).toBe("simone@spg.com");
                expect(user.body.name).toBe("Simone");
                expect(user.body.accessType).toBe(5);
                done()
            })
            .catch(err => done(err))
    })

    it("logout", function (done) {
        logoutUser()
            .then(() => done())
            .catch(err => done(err))
    })

    it("check if user is not logged in", function (done) {
        server
            .get('/api/sessions/current')
            .expect(401)
            .then(() => done())
            .catch(err => done(err))
    })

    it("wrong username", function (done) {
        server
            .post('/api/sessions')
            .send({ username: "wrong@spg.com", password: "26gKpQK9" })
            .expect(401)
            .then(() => done())
            .catch(err => done(err))
    })

    it("wrong password", function (done) {
        server
            .post('/api/sessions')
            .send({ username: "federico@spg.com", password: "wrongPassword" })
            .expect(401)
            .then(() => done())
            .catch(err => done(err))
    })

    it("wrong username and password", function (done) {
        server
            .post('/api/sessions')
            .send({ username: "wrong@spg.com", password: "wrongPassword" })
            .expect(401)
            .then(() => done())
            .catch(err => done(err))
    })
})

describe("Retrieving products and categories", () => {
    beforeAll(() => logoutUser());

    test("GET /api/products", (done) => {
        //const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

        server.get("/api/products")
            .expect(200)
            .then((response) => {
                // Check type and length
                expect(Array.isArray(response.body)).toBeTruthy();
                //expect(response.body.length).toEqual(1);

                // Check data
                expect(response.body[0].id).toBe(1);
                expect(response.body[0].farmerId).toBe(4);
                expect(response.body[0].name).toBe("Crimson Crisp Apple");
                expect(response.body[0].description).toBe("1 kg");
                expect(response.body[0].quantity).toBe(57);
                expect(response.body[0].state).toBe(1);

                expect(response.body[0].typeId).toBe(1);
                expect(response.body[0].pricePerUnit).toBe(2.2);
                expect(response.body[0].imagePath).toBe("p1-1.jpg");
                expect(response.body[0].farmer.name).toBe("Paolo");
                expect(response.body[0].farmer.surname).toBe("Rossi");
                done();
            })
            .catch(err => done(err))
    });

    test("GET /api/products/2021-11-29",  (done) => {
        //const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

        server.get("/api/products/2021-11-29")
            .expect(200)
            .then((response) => {
                // Check type and length
                expect(Array.isArray(response.body)).toBeTruthy();
                //expect(response.body.length).toEqual(1);

                // Check data
                expect(response.body[0].id).toBe(15);
                expect(response.body[0].farmerId).toBe(4);
                expect(response.body[0].name).toBe("Strawberry Compote");
                expect(response.body[0].description).toBe("240 g");
                expect(response.body[0].quantity).toBe(10);
                expect(response.body[0].state).toBe(1);

                expect(response.body[0].typeId).toBe(1);
                expect(response.body[0].pricePerUnit).toBe(5.5);
                expect(response.body[0].imagePath).toBe("p15-1.jpg");
                expect(response.body[0].ExpiringDate).toBe("2021-11-30")
                expect(response.body[0].farmer.name).toBe("Paolo");
                expect(response.body[0].farmer.surname).toBe("Rossi");
                done();
            })
            .catch(err => done(err))
    });

    test("GET /api/products/NotADate NoDate check",  (done) => {
        //const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

        server.get("/api/products/NotADate")
            .expect(422)
            .then(() => done())
            .catch(err => done(err))
    });

    test('GET /api/types', function (done) {
        server
            .get('/api/types')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                expect(response.body.length).toBe(6);

                expect(response.body[0].id).toBe(1)
                expect(response.body[0].typeName).toBe("Fruits & Vegetables")
                expect(response.body[1].id).toBe(2)
                expect(response.body[1].typeName).toBe("Dairy")
                expect(response.body[2].id).toBe(3)
                expect(response.body[2].typeName).toBe("Meat & Salumi")
                expect(response.body[3].id).toBe(4)
                expect(response.body[3].typeName).toBe("Sea Products")
                expect(response.body[4].id).toBe(5)
                expect(response.body[4].typeName).toBe("Bakery & Sweets")
                expect(response.body[5].id).toBe(6)
                expect(response.body[5].typeName).toBe("Beverages")

                done();
            })
            .catch(err => done(err));
    })

    test('GET /api/products/type/1/2021-12-01', function (done) {
        server
            .get('/api/products/type/1/2021-12-01')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                // Check data
                expect(response.body[0].id).toBe(30);
                expect(response.body[0].farmerId).toBe(9);
                expect(response.body[0].name).toBe("Rocket");
                expect(response.body[0].description).toBe("1 piece");
                expect(response.body[0].quantity).toBe(34);
                expect(response.body[0].state).toBe(1);

                expect(response.body[0].typeId).toBe(1);
                expect(response.body[0].pricePerUnit).toBe(1.0);
                expect(response.body[0].ExpiringDate).toBe('2021-12-03')
                expect(response.body[0].imagePath).toBe("p30-1.jpg");
                expect(response.body[0].farmer.name).toBe("Maria");
                expect(response.body[0].farmer.surname).toBe("Colombo");

                done();
            })
            .catch(err => done(err));
    })

    test('GET /api/products/type/2/2021-11-25', function (done) {
        server
            .get('/api/products/type/2/2021-11-25')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                // Check data
                expect(response.body[0].typeId).toBe(2);
                done();
            })
            .catch(err => done(err));
    })

    test('GET /api/products/type/3/2021-12-01', function (done) {
        server
            .get('/api/products/type/3/2021-12-01')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                // Check data
                expect(response.body[0].typeId).toBe(3);
                done();
            })
            .catch(err => done(err));
    })

    test('GET /api/products/type/4/2021-11-28', function (done) {
        server
            .get('/api/products/type/4/2021-11-28')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                // Check data
                expect(response.body[0].id).toBe(19);
                expect(response.body[0].farmerId).toBe(8);
                expect(response.body[0].name).toBe("Anchovy");
                expect(response.body[0].description).toBe("500 g");
                expect(response.body[0].quantity).toBe(23);
                expect(response.body[0].state).toBe(1);

                expect(response.body[0].typeId).toBe(4);
                expect(response.body[0].pricePerUnit).toBe(5.0);
                expect(response.body[0].imagePath).toBe("p19-1.jpg");
                expect(response.body[0].ExpiringDate).toBe("2021-11-30")
                expect(response.body[0].farmer.name).toBe("Federico");
                expect(response.body[0].farmer.surname).toBe("Bianchi");

                done();
            })
            .catch(err => done(err));
    })

    test('GET /api/products/type/5/2021-11-28', function (done) {
        server
            .get('/api/products/type/5/2021-11-28')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                // Check data
                expect(response.body[0].typeId).toBe(5);
                done();
            })
            .catch(err => done(err));
    })

    test('GET /api/products/type/6/2021-12-04', function (done) {
        server
            .get('/api/products/type/6/2021-12-04')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBeTruthy();
                // Check data
                expect(response.body[0].typeId).toBe(6);
                done();
            })
            .catch(err => done(err));
    })

    test('GET /api/products/type/6/NotADate NoDate check', function (done) {
        server
            .get('/api/products/type/6/NotADate')
            .expect(422)
            .then(() => done())
            .catch(err => done(err));
    })
})

describe('GET /api/bookings', () => {
    beforeAll(() => logoutUser());

    it('bookings should NOT be visible if not loggedIn', function (done) {
        server
            .get('/api/bookings')
            .expect(401)
            .then(() => done())
            .catch(err => done(err))
    });

    it('login as manager then show bookings', function (done) {
        loginUser(1)
            .then(() => checkBookingBody()
                .then(() => done())
                .catch(err => done(err)))
            .catch(err => done(err))
    })

    it('login as employee then show bookings', function (done) {
        loginUser(1)
            .then(() => checkBookingBody()
                .then(() => done())
                .catch(err => done(err)))
            .catch(err => done(err))
    })

    it('login as client then do NOT show booking', function (done) {
        loginUser(3)
            .then(() =>
                server
                    .get('/api/bookings')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    });

    it('login as farmer then show bookings', function (done) {
        loginUser(4)
            .then(() => checkBookingBody()
                .then(() => done())
                .catch(err => done(err)))
            .catch(err => done(err))
    })

    it('login as deliverer then show bookings', function (done) {
        loginUser(5)
            .then(() => checkBookingBody()
                .then(() => done())
                .catch(err => done(err)))
            .catch(err => done(err))
    })
});

function checkBookingBody() {
    return new Promise((resolve, reject) => {
        server
            .get('/api/bookings')
            .expect(200)
            .then(response => {
                expect(Array.isArray(response.body)).toBeTruthy();
                //expect(response.body.length).toEqual(1);

                // Check data
                expect(response.body[0].BookingId).toBe(1);
                expect(response.body[0].BookingStartDate).toBe("2021-11-12");
                expect(response.body[0].UserId).toBe(1);
                expect(response.body[0].TotalPrice).toBe(22.5);
                expect(response.body[0].State).toBe(1);
                expect(response.body[0].PickupTime).toBe("2021-11-12");
                expect(response.body[0].DeliveryTime).toBe(null);
                resolve(null);
            })
            .catch(err => reject(err))
    })
}

describe('PUT /api/bookings/:id', () => {
    beforeAll(() => logoutUser());

    it('booking should NOT be updated if not loggedIn', function (done) {
        server
            .put('/api/bookings/1')
            .send({ state: 2 })
            .expect(401)
            .then(() => done())
            .catch(err => done(err))
    });

    it('login as client then do NOT update booking', function (done) {
        loginUser(3)
            .then(() =>
                server
                    .put('/api/bookings/1')
                    .send({ state: 2 })
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    });

    it('login as deliverer then do NOT update booking', function (done) {
        loginUser(5)
            .then(() =>
                server
                    .put('/api/bookings/1')
                    .send({ state: 2 })
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    });

    it('login as manager then update booking', function (done) {
        loginUser(1)
            .then(() =>
                server
                    .put('/api/bookings/1')
                    .send({ state: 2 })
                    .expect(200)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    });

    it('login as employee then update booking', function (done) {
        loginUser(2)
            .then(() =>
                server
                    .put('/api/bookings/1')
                    .send({ state: 2 })
                    .expect(200)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    });

    it('login as farmer then update booking', function (done) {
        loginUser(4)
            .then(() =>
                server
                    .put('/api/bookings/1')
                    .send({ state: 1 })
                    .expect(200)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    });

    it('check error if state < 0', function (done) {
        loginUser(4)
            .then(() =>
                server
                    .put('/api/bookings/1')
                    .send({ state: -1 })
                    .expect(422)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    });

    it('check error if state > 3', function (done) {
        loginUser(4)
            .then(() =>
                server
                    .put('/api/bookings/1')
                    .send({ state: 4 })
                    .expect(422)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    });

});

describe('POST /api/new_client', () => {
    beforeAll(() => logoutUser());

    const client = {
        name: "Name", surname: "Surname", email: "email@spg.com", password: "123password",
        phoneNumber: "3613535798", accessType: 3, wallet: 0, address: "Corso Duca degli Abruzzi 24"
    }

    it('name empty in parameters', function (done) {
        server
            .post('/api/new_client')
            .send({ ...client, name: "" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("");
                expect(response.body.errors[0].msg).toBe("Invalid value");
                expect(response.body.errors[0].param).toBe("name");
                expect(response.body.errors[0].location).toBe("body");
                done();
            })
            .catch(err => done(err))
    });

    it('surname empty in parameters', function (done) {
        server
            .post('/api/new_client')
            .send({ ...client, surname: "" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("");
                expect(response.body.errors[0].param).toBe("surname");
                done();
            })
            .catch(err => done(err))
    })

    it('email empty in parameters', function (done) {
        server
            .post('/api/new_client')
            .send({ ...client, email: "" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("");
                expect(response.body.errors[0].param).toBe("email");
                done();
            })
            .catch(err => done(err))
    })

    it('password empty in parameters', function (done) {
        server
            .post('/api/new_client')
            .send({ ...client, password: "" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("");
                expect(response.body.errors[0].param).toBe("password");
                done();
            })
            .catch(err => done(err))
    })

    it('password shorter than 8 in parameters', function (done) {
        server
            .post('/api/new_client')
            .send({ ...client, password: "123" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("123");
                expect(response.body.errors[0].param).toBe("password");
                done();
            })
            .catch(err => done(err))
    })

    it('password longer than 30 in parameters', function (done) {
        server
            .post('/api/new_client')
            .send({ ...client, password: "1234567891234567891234567890123" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("1234567891234567891234567890123");
                expect(response.body.errors[0].param).toBe("password");
                done();
            })
            .catch(err => done(err))
    })

    it('phoneNumber shorter than 10 in parameters', function (done) {
        server
            .post('/api/new_client')
            .send({ ...client, phoneNumber: "123456789" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("123456789");
                expect(response.body.errors[0].param).toBe("phoneNumber");
                done();
            })
            .catch(err => done(err))
    })

    it('phoneNumber greater than 10 in parameters', function (done) {
        server
            .post('/api/new_client')
            .send({ ...client, phoneNumber: "12345678901" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("12345678901");
                expect(response.body.errors[0].param).toBe("phoneNumber");
                done();
            })
            .catch(err => done(err))
    })

    //Empty Wallet not checked because the default is 0.0 in dao.js

    it('accessType empty in parameters', function (done) {
        server
            .post('/api/new_client')
            .send({ ...client, accessType: undefined })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe(undefined);
                expect(response.body.errors[0].param).toBe("accessType");
                done();
            })
            .catch(err => done(err))
    })

    it('address empty in parameters', function (done) {
        server
            .post('/api/new_client')
            .send({ ...client, address: "" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("");
                expect(response.body.errors[0].param).toBe("address");
                done();
            })
            .catch(err => done(err))
    })

    it('all parameters wrong', function (done) {
        server
            .post('/api/new_client')
            .send({
                name: "", surname: "", email: "", password: "123",
                phoneNumber: "123", accessType: undefined, wallet: undefined, address: ""
            })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(7);

                expect(response.body.errors[0].param).toBe("name");
                expect(response.body.errors[1].param).toBe("surname");
                expect(response.body.errors[2].param).toBe("email");
                expect(response.body.errors[3].param).toBe("password");
                expect(response.body.errors[4].param).toBe("phoneNumber");
                expect(response.body.errors[5].param).toBe("accessType");
                expect(response.body.errors[6].param).toBe("address");
                done();
            })
            .catch(err => done(err))
    })

    it('create new user', function (done) {
        server
            .post('/api/new_client')
            .send(client)
            .expect(201)
            .then(() => done())
            .catch(err => done(err))
    })
});

describe('GET /api/clients', () => {
    beforeAll(() => logoutUser());

    it('should NOT see clients as not logged in', function (done) {
        server
            .get('/api/clients')
            .expect(401)
            .then(() => done())
            .catch(err => done(err))
    })

    it('login as client then do NOT show clients', function (done) {
        loginUser(3)
            .then(() =>
                server
                    .get('/api/clients')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    })

    it('login as farmer then do NOT show clients', function (done) {
        loginUser(4)
            .then(() =>
                server
                    .get('/api/clients')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    })

    it('login as deliverer then do NOT show clients', function (done) {
        loginUser(5)
            .then(() =>
                server
                    .get('/api/clients')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err)))
            .catch(err => done(err))
    })

    it('login as manager then show clients', function (done) {
        loginUser(1)
            .then(() =>
                server
                    .get('/api/clients')
                    .expect(200)
                    .then((response) => {
                        expect(Array.isArray(response.body)).toBeTruthy();

                        expect(response.body[0].id).toBe(3);
                        expect(response.body[0].name).toBe("Ferderico");
                        expect(response.body[0].surname).toBe("Valverde");
                        expect(response.body[0].email).toBe("federico@spg.com");
                        expect(response.body[0].phoneNumber).toBe("03911657244");
                        expect(response.body[0].accessType).toBe(3);
                        expect(response.body[0].wallet).toBe(105043.0);
                        expect(response.body[0].address).toBe("Via Campi Flegrei 37");
                        done();
                    })
                    .catch(err => done(err)))
            .catch(err => done(err))
    })

    it('login as employee then show clients', function (done) {
        loginUser(2)
            .then(() =>
                server
                    .get('/api/clients')
                    .expect(200)
                    .then((response) => {
                        expect(Array.isArray(response.body)).toBeTruthy();

                        expect(response.body[0].id).toBe(3);
                        expect(response.body[0].name).toBe("Ferderico");
                        expect(response.body[0].surname).toBe("Valverde");
                        expect(response.body[0].email).toBe("federico@spg.com");
                        expect(response.body[0].phoneNumber).toBe("03911657244");
                        expect(response.body[0].accessType).toBe(3);
                        expect(response.body[0].wallet).toBe(105043.0);
                        expect(response.body[0].address).toBe("Via Campi Flegrei 37");
                        done();
                    })
                    .catch(err => done(err)))
            .catch(err => done(err))
    })
})

describe('GET /api/products/:farmerId/:state', () => {
    beforeAll(() => logoutUser());

    it('should not be able to see those products as NOT logged in', function (done) {
        server
            .get('/api/products/4/1')
            .expect(401)
            .then(() => done())
            .catch(err => done(err));
    })

    it('login as employee then do NOT show products', function (done) {
        loginUser(2)
            .then(() =>
                server
                    .get('/api/products/4/1')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as client then do NOT show products', function (done) {
        loginUser(3)
            .then(() =>
                server
                    .get('/api/products/4/1')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as deliverer then do NOT show products', function (done) {
        loginUser(5)
            .then(() =>
                server
                    .get('/api/products/4/1')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as manager then show products in state 1', function (done) {
        loginUser(1)
            .then(() =>
                server
                    .get('/api/products/4/1')
                    .expect(200)
                    .then((response) => {
                        expect(Array.isArray(response.body)).toBeTruthy();
                        //expect(response.body.length).toEqual(1);

                        // Check data
                        expect(response.body[0].Id).toBe(1);
                        expect(response.body[0].FarmerId).toBe(4);
                        expect(response.body[0].Name).toBe("Crimson Crisp Apple");
                        expect(response.body[0].Description).toBe("1 kg");
                        expect(response.body[0].Quantity).toBe(57);
                        expect(response.body[0].State).toBe(1);

                        expect(response.body[0].TypeId).toBe(1);
                        expect(response.body[0].PricePerUnit).toBe(2.2);

                        done();
                    })
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as farmer then show products in state 0', function (done) {
        loginUser(4)
            .then(() =>
                server
                    .get('/api/products/4/0')
                    .expect(200)
                    .then((response) => {
                        expect(Array.isArray(response.body)).toBeTruthy();
                        //expect(response.body.length).toEqual(1);

                        // Check data
                        expect(response.body[0].Id).toBe(34);
                        expect(response.body[0].FarmerId).toBe(4);
                        expect(response.body[0].Name).toBe("Apricot Jam Tart");
                        expect(response.body[0].Description).toBe("400 g");
                        expect(response.body[0].Quantity).toBe(96);
                        expect(response.body[0].State).toBe(0);

                        expect(response.body[0].TypeId).toBe(5);
                        expect(response.body[0].PricePerUnit).toBe(9.0);

                        done();
                    })
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })



})

describe('POST /api/product', () => {
    beforeAll(() => logoutUser());

    const product = { FarmerId: 4, Name: "TestProduct", Description: "100 g", Quantity: 30, State: 0, TypeId: 6, PricePerUnit: 3.75 }

    it('should not be able to create a product if not logged in', function (done) {
        server
            .post('/api/product')
            .send(product)
            .expect(401)
            .then(() => done())
            .catch(err => done(err))
    })

    it('login as employee then do NOT create product', function (done) {
        loginUser(2)
            .then(() =>
                server
                    .post('/api/product')
                    .send(product)
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as client then do NOT create product', function (done) {
        loginUser(3)
            .then(() =>
                server
                    .post('/api/product')
                    .send(product)
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as deliverer then do NOT create product', function (done) {
        loginUser(5)
            .then(() =>
                server
                    .post('/api/product')
                    .send(product)
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as farmer then create product', function (done) {
        loginUser(4)
            .then(() =>
                server
                    .post('/api/product')
                    .send(product)
                    .expect(201)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as manager then create product', function (done) {
        loginUser(4)
            .then(() =>
                server
                    .post('/api/product')
                    .send(product)
                    .expect(201)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('FarmerId empty in parameters', function (done) {
        server
            .post('/api/product')
            .send({ ...product, FarmerId: undefined })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe(undefined);
                expect(response.body.errors[0].msg).toBe("Invalid value");
                expect(response.body.errors[0].param).toBe("FarmerId");
                expect(response.body.errors[0].location).toBe("body");
                done();
            })
            .catch(err => done(err))
    });

    it('Name empty in parameters', function (done) {
        server
            .post('/api/product')
            .send({ ...product, Name: "" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("");
                expect(response.body.errors[0].param).toBe("Name");
                done();
            })
            .catch(err => done(err))
    });

    it('Description empty in parameters', function (done) {
        server
            .post('/api/product')
            .send({ ...product, Description: "" })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe("");
                expect(response.body.errors[0].param).toBe("Description");
                done();
            })
            .catch(err => done(err))
    });

    it('Quantity empty in parameters', function (done) {
        server
            .post('/api/product')
            .send({ ...product, Quantity: undefined })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe(undefined);
                expect(response.body.errors[0].param).toBe("Quantity");
                done();
            })
            .catch(err => done(err))
    });

    it('State empty in parameters', function (done) {
        server
            .post('/api/product')
            .send({ ...product, State: undefined })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe(undefined);
                expect(response.body.errors[0].param).toBe("State");
                done();
            })
            .catch(err => done(err))
    });

    it('TypeId empty in parameters', function (done) {
        server
            .post('/api/product')
            .send({ ...product, TypeId: undefined })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe(undefined);
                expect(response.body.errors[0].param).toBe("TypeId");
                done();
            })
            .catch(err => done(err))
    });

    it('PricePerUnit empty in parameters', function (done) {
        server
            .post('/api/product')
            .send({ ...product, PricePerUnit: undefined })
            .expect(422)
            .then((response) => {
                expect(Array.isArray(response.body.errors)).toBeTruthy();
                expect(response.body.errors.length).toEqual(1);

                expect(response.body.errors[0].value).toBe(undefined);
                expect(response.body.errors[0].param).toBe("PricePerUnit");
                done();
            })
            .catch(err => done(err))
    });

})

describe('PUT /api/product/:State/:Id', () => {
    beforeAll(() => logoutUser());

    it('cannot update product state as not logged in', function (done) {
        server
            .put('/api/product/2/1')
            .expect(401)
            .then(() => done())
            .catch(err => done(err));
    })

    it('cannot update product state as employee', function (done) {
        loginUser(2)
            .then(() => {
                server
                    .put('/api/product/2/1')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })

    it('cannot update product state as client', function (done) {
        loginUser(3)
            .then(() => {
                server
                    .put('/api/product/2/1')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })

    it('cannot update product state as deliverer', function (done) {
        loginUser(5)
            .then(() => {
                server
                    .put('/api/product/2/1')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })

    it('update product state as manager', function (done) {
        loginUser(1)
            .then(() => {
                server
                    .put('/api/product/0/1')
                    .expect(200)
                    .then(() => done())
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })

    it('update product state as farmer', function (done) {
        loginUser(1)
            .then(() => {
                server
                    .put('/api/product/1/1')
                    .expect(200)
                    .then(() => done())
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })

    /* FAILS: MODIFIES first product and then makes problem with other tests
    it('update product with not existing state', function (done) {
        server
            .put('/api/product/5/1')
            .expect(422)
            .then(() => done())
            .catch(err => done(err))
    })*/
})

describe('PUT /api/topup/:userId/:amount', () => {
    beforeAll(() => logoutUser());

    it('cannot update wallet state as not logged in', function (done) {
        server
            .put('/api/topup/2/1')
            .expect(401)
            .then(() => done())
            .catch(err => done(err));
    })

    it('cannot update wallet state as client', function (done) {
        loginUser(3)
            .then(() => {
                server
                    .put('/api/topup/2/1')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })

    it('cannot update wallet state as deliverer', function (done) {
        loginUser(5)
            .then(() => {
                server
                    .put('/api/topup/2/1')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })

    it('cannot update wallet state as farmer', function (done) {
        loginUser(4)
            .then(() => {
                server
                    .put('/api/topup/2/1')
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })

    it('update wallet state as employee', function (done) {
        loginUser(2)
            .then(() => {
                server
                    .put('/api/topup/1/1')
                    .expect(200)
                    .then(() => done())
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })

    it('update wallet state as manager', function (done) {
        loginUser(1)
            .then(() => {
                server
                    .put('/api/topup/1/1')
                    .expect(200)
                    .then(() => done())
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })
    
})
 
describe('POST /api/image', () => {
    beforeAll(() => logoutUser());
    
    const image = {
        id: 53,
        path: "p1-1.jpg"
    };

    it('should not be able to post a image if not logged in', function (done) {
        server
            .post('/api/image')
            .send(image)
            .expect(401)
            .then(() => done())
            .catch(err => done(err))
    })

    it('login as employee then do NOT add image', function (done) {
        loginUser(2)
            .then(() =>
                server
                    .post('/api/image')
                    .send(image)
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as client then do NOT add image', function (done) {
        loginUser(3)
            .then(() =>
                server
                    .post('/api/image')
                    .send(image)
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as deliverer then do NOT add image', function (done) {
        loginUser(5)
            .then(() =>
                server
                    .post('/api/image')
                    .send(image)
                    .expect(403)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as farmer then add image', function (done) {
        loginUser(4)
            .then(() =>
                server
                    .post('/api/image')
                    .send({
                        id: 54,
                        path: "p1-1.jpg"
                    })
                    .expect(201)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('login as manager then add image', function (done) {
        loginUser(4)
            .then(() =>
                server
                    .post('/api/image')
                    .send({
                        id: 56,
                        path: "p1-1.jpg"
                    })
                    .expect(201)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(err => done(err))
    })

    it('Id empty in parameters', function (done) {
        server
            .post('/api/image')
            .send({Path: 'p1-1.jpg', Id: undefined })
            .expect(503)
            .then((response) => {
                done();
            })
            .catch(err => done(err))
    });
  
    it('Path empty in parameters', function (done) {
        server
            .post('/api/image')
            .send({ Id:54,
                Path: undefined})
            .expect(503)
            .then((response) => {
                done();
            })
            .catch(err => done(err))
    });
}) 