// story17.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test



describe('Confirm Booking', () => {
    it('successfully loads', () => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:3000') // change URL to match your dev URL
        cy.get('#resetTime').click()
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('paolo@spg.com')
            .should('have.value', 'paolo@spg.com')
        cy.get('#formBasicPassword')
            .type('eGB2VrUe')
            .should('have.value', 'eGB2VrUe')
        cy.get('.btn').click()
        cy.get('#day').type('{selectall}28').should('have.value', '28')
        cy.get('#month').type('{selectall}11').should('have.value', '11')
        cy.get('#year').type('{selectall}2021' ).should('have.value', '2021') 
        cy.get('[href="/FarmerHome"]').click()
       
        cy.get(':nth-child(1) > form > .buttonEditConfirm > .form-control')
            .type('20')
            .should('have.value', '20')
            cy.get(':nth-child(1) > form > .buttonEditConfirm > .btn').click({force: true})

    })
})
