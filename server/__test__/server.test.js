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