// story15.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test


describe('Aknowledge delivery', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('luca@spg.com')
            .should('have.value', 'luca@spg.com')
        cy.get('#formBasicPassword')
            .type('FgKECe4w')
            .should('have.value', 'FgKECe4w')
        cy.get('.btn').click()
        cy.get('[href="/WareHouseHome"]').click()
        cy.get(':nth-child(4) > :nth-child(3) > form > .form-check > #custom-switch').click()

        
    })
})