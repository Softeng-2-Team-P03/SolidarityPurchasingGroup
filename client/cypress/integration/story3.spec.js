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

    })
})


describe('Browse products in shop by logged user', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('client@ggg.com')
            .should('have.value', 'client@ggg.com')
        cy.get('#formBasicPassword')
            .type('mnbvcxz12345')
            .should('have.value', 'mnbvcxz12345')
        cy.get('.w-50 > .btn').click()
        cy.get('[href="/"]').click()
        cy.get(':nth-child(3) > [href="/products"]').click()

    })
})