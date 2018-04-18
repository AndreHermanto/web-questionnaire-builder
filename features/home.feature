Feature: Home

  Scenario: Visit homepage

    Given I open `homepage`
    Then I wait to see `username input`
    Then I wait to see `password input`
