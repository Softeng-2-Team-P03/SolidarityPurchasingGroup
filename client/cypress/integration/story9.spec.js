// story9.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test



describe('Report availability', () => {
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
        cy.get('#day').type('{selectall}25').should('have.value', '25')
        cy.get('#month').type('{selectall}11').should('have.value', '11')
        cy.get('#year').type('{selectall}2021').should('have.value', '2021')
        cy.get('.btn').click()
        cy.get('[href="/FarmerHome"]').click()
        
        cy.get('.addP').click()
        cy.uploadFile('./' + 'testImage', 'jpg', '#customFile');
        cy.get('#customFile').trigger('change', { force: true })


        cy.get('#formName')
            .type('Apple')
            .should('have.value', 'Apple')
        cy.get('#formDescription')
            .type('500 g')
            .should('have.value', '500 g')
        cy.get('#formQuantity')
            .type('20')
            .should('have.value', '20')
        cy.get('#formType').select('Fruits and Vegetables')
        cy.get('#formPricePerUnit')
            .type('3')
            .should('have.value', '3')
        cy.get('.modal-body > :nth-child(4) > .btn').click()
    })
})
