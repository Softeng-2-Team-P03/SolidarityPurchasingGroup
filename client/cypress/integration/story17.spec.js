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
        cy.contains('Login').click()
        cy.get('#formBasicEmail')
            .type('paolo@spg.com')
            .should('have.value', 'paolo@spg.com')
        cy.get('#formBasicPassword')
            .type('eGB2VrUe')
            .should('have.value', 'eGB2VrUe')
        cy.get('.btn').click()
        cy.get('[href="/FarmerHome"]').click()
        cy.get('#resetTime').click()
        cy.get(':nth-child(1) > .row > :nth-child(5) > form > .buttonConfirm > .form-control')
            .type('20')
            .should('have.value', '20')
        cy.get(':nth-child(1) > .row > :nth-child(5) > form > .buttonConfirm > .btn').click()

    })
})
