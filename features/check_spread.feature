Feature: Check Spread

  Scenario: Spread is within 10 percent
    Given the price is 110
    And the bid is 100
    When I check the spread
    Then the result should be true

  Scenario: Spread is more than 10 percent
    Given the price is 200
    And the bid is 100
    When I check the spread
    Then the result should be false