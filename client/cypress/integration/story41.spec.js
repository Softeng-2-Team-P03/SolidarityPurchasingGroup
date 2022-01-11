// story41.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Unretrieved food reports', () => {
    it('successfully loads', () => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.get('#resetTime').click()
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('luca@spg.com')
            .should('have.value', 'luca@spg.com')
        cy.get('#formBasicPassword')
            .type('FgKECe4w')
            .should('have.value', 'FgKECe4w')
        cy.get('.btn').click()
        cy.get('[href="/unretrievedFood"]').click()
       

    })
})
