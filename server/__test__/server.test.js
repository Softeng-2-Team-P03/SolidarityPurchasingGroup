const express = require('express');
const app = require("../server");
const supertest = require("supertest");


// This passes because 1 === 1
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

test("GET /api/bookings", async () => {
    //const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

    await supertest(app).get("/api/bookings")
        .expect(200)
        .then((response) => {
            // Check type and length
            expect(Array.isArray(response.body)).toBeTruthy();
            //expect(response.body.length).toEqual(1);

            // Check data
            expect(response.body[0].BookingId).toBe(1);
            expect(response.body[0].BookingStartDate).toBe("2021-11-12");
            expect(response.body[0].UserId).toBe(1);
        });
});