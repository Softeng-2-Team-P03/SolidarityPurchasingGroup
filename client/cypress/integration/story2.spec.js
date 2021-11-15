// story2.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test


describe('New customer registration', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.get('[href="/addClient"] > .btn').click( {force: true})
        cy.get('#formName')
            .type('Mario')
            .should('have.value', 'Mario')
        cy.get('#formSurname')
            .type('Rossi')
            .should('have.value', 'Rossi')
        cy.get('#formEmail')
            .type('mrm@gmail.com')
            .should('have.value', 'mrm@gmail.com')
        cy.get(':nth-child(4) > #formPhoneNumber')
            .type('password@')
            .should('have.value', 'password@')
        cy.get(':nth-child(5) > #formPhoneNumber')
            .type('3453652347')
            .should('have.value', '3453652347')
        cy.get('#formAddress')
            .type('Corso Duca Degli Abruzzi 123')
            .should('have.value', 'Corso Duca Degli Abruzzi 123')
        cy.get(' form > .btn').click()

    })
})

describe('New customer registration made by the shopper Employee', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('mr.banouie@gmail.com')
            .should('have.value', 'mr.banouie@gmail.com')
        cy.get('#formBasicPassword')
            .type('mnbvcxz12345')
            .should('have.value', 'mnbvcxz12345')
        cy.get('.btn').click()
        cy.get('[href="/clients"]').click()
        cy.get('#add-client-btn').click()
        cy.get('#formName')
            .type('Mario')
            .should('have.value', 'Mario')
        cy.get('#formSurname')
            .type('Rossi')
            .should('have.value', 'Rossi')
        cy.get('#formEmail')
            .type('mrm@gmail.com')
            .should('have.value', 'mrm@gmail.com')
        cy.get(':nth-child(4) > #formPhoneNumber')
            .type('password@')
            .should('have.value', 'password@')
        cy.get(':nth-child(5) > #formPhoneNumber')
            .type('3453652347')
            .should('have.value', '3453652347')
        cy.get('#formAddress')
            .type('Corso Duca Degli Abruzzi 123')
            .should('have.value', 'Corso Duca Degli Abruzzi 123')
        cy.get(' form > .btn').click()

    })
})
