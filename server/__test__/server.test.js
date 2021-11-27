const express = require('express');
const app = require("../server");
const supertest = require("supertest");
const server = supertest.agent(app);

// This passes because 1 === 1
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

function loginUser(accessType) {
    let credentials = { username: "federico@spg.com", password: "26gKpQK9" } //client if different accessType
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

    return function (done) {
        server
            .post('/api/sessions')
            .send(credentials)
            .expect(200)
            .then(() => done())
            .catch(err => done(err))
    }
}

describe("Retrieving products", () => {
    test("GET /api/products", async () => {
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
            });
    });

    test("GET /api/products/1", async () => {
        //const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

        server.get("/api/products/1")
            .expect(200)
            .then((response) => {
                // Check that is not an array since we only want the specified product
                expect(Array.isArray(response.body)).not.toBeTruthy();

                // Check data
                expect(response.body.id).toBe(1);
                expect(response.body.farmerId).toBe(4);
                expect(response.body.name).toBe("Crimson Crisp Apple");
                expect(response.body.description).toBe("1 kg");
                expect(response.body.quantity).toBe(57);
                expect(response.body.state).toBe(1);
                expect(response.body.typeId).toBe(1);
                expect(response.body.pricePerUnit).toBe(2.2);
                expect(Array.isArray(response.body.images)).toBeTruthy();
                expect(response.body.images[0].id).toBe(1)
                expect(response.body.images[0].productId).toBe(1)
                expect(response.body.images[0].isDefault).toBe(1)
                expect(response.body.images[0].path).toBe("p1-1.jpg")
                //expect(response.body.farmer.name).toBe("Paolo");
                //expect(response.body.farmer.surname).toBe("Rossi");
            });
    });

})

function checkBookingBody() {
    return function (done) {
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
                expect(response.body[0].State).toBe("1");
                expect(response.body[0].PickupTime).toBe("2021-11-12");
                expect(response.body[0].DeliveryTime).toBe(null);
                done();
            })
function logoutUser() {
    return function (done) {
        server
            .delete('/api/sessions/current')
            .expect(200)
            .then(() => done())
            .catch(err => done(err))
    }
}

describe('GET /api/bookings', () => {
    it('bookings should NOT be visible if not loggedIn', function (done) {
        server
            .get('/api/bookings')
            .expect(401)
            .then(() => done())
            .catch(err => done(err))
    });
    it('login as manager', loginUser(1));
    it('bookings should be visible as manager', checkBookingBody());
    it('login as employee', loginUser(2));
    it('bookings should be visible as employee', checkBookingBody());
    it('login as client', loginUser(3));
    it('bookings should NOT be visible as client', function (done) {
        server
            .get('/api/bookings')
            .expect(403)
            .then(() => done())
            .catch(err => done(err))
    });
});

function checkBookingBody() {
    return function (done) {
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
                expect(response.body[0].State).toBe("1");
                expect(response.body[0].PickupTime).toBe("2021-11-12");
                expect(response.body[0].DeliveryTime).toBe(null);
                done();
            })
            .catch(err => done(err))
    }
}

