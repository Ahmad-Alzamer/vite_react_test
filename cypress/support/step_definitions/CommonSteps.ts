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


Then("take a screenshot", function () {
    cy.screenshot();
});


Given("screen size is {int} * {int}", function (width: number, height: number) {
    cy.viewport(width,height);
});