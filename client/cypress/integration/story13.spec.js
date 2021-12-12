// story13.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Select pick-up date', () => {
    it('successfully loads', () => {
        cy.viewport(1920, 1080)
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
        cy.get(':nth-child(2) > a > .btn').click()
        cy.get('#resetTime').click()

        cy.get('#decrementDay').click()
        cy.get('#decrementDay').click()
        cy.get('#decrementDay').click()
        cy.get('#decrementDay').click()
        cy.get('#decrementDay').click()
        cy.get('#decrementDay').click()
        cy.get('#decrementDay').click()
        cy.get(':nth-child(1) > .text-center > :nth-child(5) > :nth-child(3)').click()
        cy.get(':nth-child(1) > .text-center > :nth-child(6) > .btn').click()
        cy.get('[data-testid="cartButton"]').click()
        cy.get('.form-select').select('Pick-up date')
        cy.get('.MuiInputAdornment-root > .MuiButtonBase-root').click()
        cy.get('.MuiInputAdornment-root > .MuiButtonBase-root').click()
        cy.get('.butn > .btn').click()
        
    })
})