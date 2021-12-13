// story16.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test


describe('Booking Delete', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('federico.clientespg@gmail.com')
            .should('have.value', 'federico.clientespg@gmail.com')
        cy.get('#formBasicPassword')
            .type('26gKpQK9')
            .should('have.value', '26gKpQK9')
        cy.get('.btn').click()
        cy.get('[href="/myOrders"]').click()
        cy.get('#resetTime').click()
        cy.get(':nth-child(1) > :nth-child(6) > .btn').click()
    })
})


describe('Booking Update Quantity', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('federico.clientespg@gmail.com')
            .should('have.value', 'federico.clientespg@gmail.com')
        cy.get('#formBasicPassword')
            .type('26gKpQK9')
            .should('have.value', '26gKpQK9')
        cy.get('.btn').click()
        cy.get('[href="/myOrders"]').click()
        cy.get('#resetTime').click()
        cy.get('#decrementDay').click()
        cy.get('#decrementDay').click()
        cy.get(':nth-child(3) > :nth-child(7) > [data-testid="cartButton"]').click()
        cy.get('.form-select').select('Pick-up date')
        cy.get('#mui-3')
            .type('16/12/2021 13:00')
            .should('have.value', '16/12/2021 13:00')
        cy.get(':nth-child(3) > .cartButtons').click()
        cy.get('.butn > .btn').click()
       
       
    })
})

describe('Booking Remove Product', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('federico.clientespg@gmail.com')
            .should('have.value', 'federico.clientespg@gmail.com')
        cy.get('#formBasicPassword')
            .type('26gKpQK9')
            .should('have.value', '26gKpQK9')
        cy.get('.btn').click()
        cy.get('[href="/myOrders"]').click()
        cy.get('#resetTime').click()
        cy.get('#decrementDay').click()
        cy.get('#decrementDay').click()
        cy.get(':nth-child(1) > :nth-child(7) > [data-testid="cartButton"]').click()
        cy.get('.form-select').select('Pick-up date')
        cy.get('#mui-3')
            .type('16/12/2021 13:00')
            .should('have.value', '16/12/2021 13:00')
        cy.get(':nth-child(1) > .delete').click()
        cy.get('.butn > .btn').click()
       
       
    })
})