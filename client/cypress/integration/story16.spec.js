// story16.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test



describe('Booking Update Quantity', () => {
    it('successfully loads', () => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.get('#resetTime').click() 
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('federico.clientespg@gmail.com')
            .should('have.value', 'federico.clientespg@gmail.com')
        cy.get('#formBasicPassword')
            .type('26gKpQK9')
            .should('have.value', '26gKpQK9')
        cy.get('.btn').click()
        cy.get('#day').type('{selectall}28').should('have.value', '28')
        cy.get('#month').type('{selectall}11').should('have.value', '11')
        cy.get('#year').type('{selectall}2021' ).should('have.value', '2021') 
        cy.get('[href="/myOrders"]').click()
        cy.get('[data-testid="cartButton"]').click()
        cy.get(':nth-child(3) > .cartButtons').click()
        
        cy.get(':nth-child(3) > .cartButtons').click()
        cy.get('.butn > .btn').click()
       
       
    })
})


describe('Booking Remove Product', () => {
    it('successfully loads', () => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.get('#resetTime').click() 
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('federico.clientespg@gmail.com')
            .should('have.value', 'federico.clientespg@gmail.com')
        cy.get('#formBasicPassword')
            .type('26gKpQK9')
            .should('have.value', '26gKpQK9')
        cy.get('.btn').click()
        cy.get('#day').type('{selectall}28').should('have.value', '28')
        cy.get('#month').type('{selectall}11').should('have.value', '11')
        cy.get('#year').type('{selectall}2021' ).should('have.value', '2021') 
        cy.get('[href="/myOrders"]').click()
        cy.get('[data-testid="cartButton"]').click()
        cy.get('.row > :nth-child(1) > .cartButtons').click()       
        cy.get(':nth-child(1) > .delete').click()
        cy.get('.butn > .btn').click()
       
       
    })
})


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
        cy.get(':nth-child(1) > :nth-child(6) > .btn').click({force: true})
    })
})

