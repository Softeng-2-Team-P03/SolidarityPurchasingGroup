// story5.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test


describe('Top up wallet', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('clodia@spg.com')
            .should('have.value', 'clodia@spg.com')
        cy.get('#formBasicPassword')
            .type('Mnbvcxz1234')
            .should('have.value', 'Mnbvcxz1234')
        cy.get('.btn').click()
        cy.get('[href="/clients"]').click()
        cy.get(':nth-child(1) > :nth-child(4) > span > .d-none').click()
        cy.get('#formBasicEmail')
        .type('50')
        .should('have.value', '50')
        cy.get('form > .btn').click()
    })
})