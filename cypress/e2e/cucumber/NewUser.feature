Feature: New User tab
  Background:
    Given screen size is 1500 * 1200


  Scenario: loading the new user view
    Given I visit the application page
    When I click the 'NewUser' tab
    Then form 'User Registration' is loaded
    And form page 'Personal Info' is loaded
    And 'First Name' is displayed
    And 'Last Name' is displayed
    And 'Gender' is displayed
    And 'Next' is displayed
    And 'Reset' is displayed

  Scenario: user can't submit 'Personal Info' page and proceed to the next page if first name is not provided
    Given I visit the application page
    And I click the 'NewUser' tab
    When 'Last Name' input is set to 'Doe'
    And 'Gender' select is set to 'Male'
    And click 'Next' button
    Then 'First Name' is marked as invalid
    And error message 'First Name is a required field' for the field labelled 'First Name'

  Scenario: user can't submit 'Personal Info' page and proceed to the next page if last name is not provided
    Given I visit the application page
    And I click the 'NewUser' tab
    When 'First Name' input is set to 'John'
    And 'Gender' select is set to 'Male'
    And click 'Next' button
    Then 'Last Name' is marked as invalid
    And error message 'Last Name is a required field' for the field labelled 'Last Name'

  Scenario: user can't submit 'Personal Info' page and proceed to the next page if last name is not provided
    Given I visit the application page
    And I click the 'NewUser' tab
    When 'First Name' input is set to 'John'
    And 'Last Name' input is set to 'Doe'
    And click 'Next' button
    Then 'Gender' is marked as invalid
    And error message 'please select a value' for the field labelled 'Gender'

  Scenario: user can submit 'Personal Info' page and proceed to the next page if all the mandatory fields are provided
    Given I visit the application page
    And I click the 'NewUser' tab
    When 'First Name' input is set to 'John'
    And 'Last Name' input is set to 'Doe'
    And 'Gender' select is set to 'Male'
    And click 'Next' button
    Then form page 'Account Info' is loaded

  Scenario: user can't submit 'Account Info' page and proceed to the next page if last name is not provided
    Given I visit the application page
    And I click the 'NewUser' tab
    And 'Personal Info' page is submitted
    Then click 'Next' button
    And 'User Name' is marked as invalid
    And error message 'User Name is a required field' for the field labelled 'User Name'
