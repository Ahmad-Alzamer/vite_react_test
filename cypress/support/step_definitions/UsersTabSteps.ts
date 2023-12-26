import { When } from "@badeball/cypress-cucumber-preprocessor";



When("I should see the users data", function () {

    cy.get('section#users table',{
        timeout:2000
    }).should('have.length', 1)

    cy.contains('ID')
        .closest('table')
        .should('have.length',1);
    cy.contains('Gender')
        .closest('table')
        .should('have.length',1);
    cy.contains('First Name')
        .closest('table')
        .should('have.length',1);
    cy.contains('Last Name')
        .closest('table')
        .should('have.length',1);
});