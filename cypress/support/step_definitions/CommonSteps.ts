import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";


When("I visit the application page", function () {
    cy.visit('/');
});
Then("I should see the header", function () {
    cy.get('.hero').should('have.length', 1)
});
Then(/^I should see the navigation tabs$/, function () {
    cy.get('.hero .hero-foot .tabs li>a').should('have.length', 6)
});


When("I click the {string} tab", function (tab: string) {
    cy.contains(tab)
        .closest('.hero .hero-foot .tabs li>a').click()
});

When("click {string} button", function (buttonText: string) {
    cy.contains(buttonText).click()
});


Then("take a screenshot", function () {
    cy.screenshot();
});


Given("screen size is {int} * {int}", function (width: number, height: number) {
    cy.viewport(width,height);
});

Then("{string} is displayed", function (label: string) {

    cy.contains(label).should('exist');

});

When("{string} input is set to {string}", function (fieldLabel: string, fieldValue: string) {
    cy.contains(fieldLabel).closest('.field').find('input').type(fieldValue);
});

When("{string} select is set to {string}", function (fieldLabel: string, selectText: string) {
    cy.contains(fieldLabel)
        .closest('.field')
        .find('select')
        .select(selectText)

});

Then("{string} is marked as invalid", function (fieldLabel: string) {
    cy.contains(fieldLabel).closest('.field').find('input,.select').should('have.class','is-danger');
});
Then("error message {string} for the field labelled {string}", function (errorMessage: string, fieldLabel: string) {

    cy.contains(fieldLabel).closest('.field')
        .contains(errorMessage)
        .should('exist')
        .should('have.class','is-danger');

});