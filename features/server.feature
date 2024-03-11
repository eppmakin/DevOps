Feature: Order submission
  As a user
  I want to submit orders
  So that they can be processed

  Scenario: Submitting a valid order
    Given I have a valid order
    When I submit the order
    Then the order is accepted

  Scenario: Submitting an invalid order
    Given I have an invalid order
    When I submit the order
    Then the order is rejected