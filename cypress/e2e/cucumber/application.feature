Feature: application
  Background:
    Given screen size is 1500 * 900
  Scenario: visiting the frontpage
    When I visit the application page
    Then I should see the header
    And I should see the navigation tabs
    And take a screenshot

