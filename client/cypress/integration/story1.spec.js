// story1.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test



describe('New client order made by the shopper Employee', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('emp@test.com')
            .should('have.value', 'emp@test.com')
        cy.get('#formBasicPassword')
            .type('mnbvcxz12345')
            .should('have.value', 'mnbvcxz12345')
        cy.get('.w-50 > .btn').click()
        cy.get('[href="/clients"]').click()
        cy.get(':nth-child(1) > :nth-child(5) > a > .buttonNewOrder').click()
        cy.get(':nth-child(1) > .text-center > :nth-child(5) > :nth-child(3)').click({force: true})
        cy.get(':nth-child(1) > .text-center > :nth-child(6) > .btn').click({force: true})
        cy.get('[data-testid=cartButton]').click({force: true})
        cy.get('.modal-header > .col > .btn').click({force: true})



    })
})


describe('New client order', () => {
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
        cy.get(':nth-child(2) > a > .btn').click({force:true})
        cy.get(':nth-child(1) > .text-center > :nth-child(5) > :nth-child(3)').click({force: true})
        cy.get(':nth-child(1) > .text-center > :nth-child(6) > .btn').click({force: true})
        cy.get('[data-testid=cartButton]').click({force: true})
        cy.get('.modal-header > .col > .btn').click({force: true})



    })
})