Feature: Users tab
  Background:
    Given screen size is 1500 * 900


  Scenario: loading the users table
    Given I visit the application page
    When I click the 'Users' tab
    And I should see the users data
    And take a screenshot