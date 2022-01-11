// story12.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test


describe('Select delivery date', () => {
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
        cy.get(':nth-child(1) > [href="/products"]').click()
        cy.get(':nth-child(1) > .text-center > :nth-child(5) > :nth-child(3)').click({force: true})
        cy.get(':nth-child(1) > .text-center > :nth-child(6) > .btn').click({force: true})
        cy.get('[data-testid=cartButton]').click({force: true})        
        cy.get('.form-select').select('Delivery at home (€ 3.00)')
        cy.get('#mui-3').type('{selectall}01/12/2021 13:30').should('have.value', '01/12/2021 13:30')
        cy.get('.butn > .btn').click({force: true})
        



    })
})
