import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";





Then("form {string} is loaded", function (formHeader: string) {

    cy.contains(formHeader).should('exist')

});

Then("form page {string} is loaded", function (pageHeader: string) {

    cy.contains(pageHeader).should('exist')

});


Given("'Personal Info' page is submitted", function () {
    cy.contains('First Name').closest('.field').find('input').type('John');
    cy.contains('Last Name').closest('.field').find('input').type('Doe');
    cy.contains('Gender')
        .closest('.field')
        .find('select')
        .select('Male');
    cy.contains('Next').click()
});