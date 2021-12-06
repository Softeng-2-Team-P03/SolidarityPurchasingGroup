// story3.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test



describe('Browse products in shop', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.get(':nth-child(2) > a > .btn').click({force: true})
        cy.get('#resetTime').click()

    })
})


describe('Browse products in shop by logged user', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('federico@spg.com')
            .should('have.value', 'federico@spg.com')
        cy.get('#formBasicPassword')
            .type('26gKpQK9')
            .should('have.value', '26gKpQK9')
        cy.get('.btn').click()
        cy.get('[href="/"]').click()
        cy.get('#basic-navbar-nav > :nth-child(2) > [href="/products"]').click()
        cy.get('#resetTime').click()

    })
})