Feature: Water intake calculation (API and UI tests)

  Scenario: Successful calculation via API for Sochi
    Given the service is available
    And I send POST request to "/api/water-norm/calculate" with body:
      | field  | value |
      | city   | Sochi |
      | weight | 70    |
    Then response status is 200
    And response success is true
    And recommended_norm_liters is 2.7

  Scenario: Successful calculation via API for Murmansk
    Given the service is available
    And I send POST request to "/api/water-norm/calculate" with body:
      | field  | value    |
      | city   | Murmansk |
      | weight | 70       |
    Then response status is 200
    And response success is true
    And recommended_norm_liters is 1.9

  Scenario Outline: Data-Driven API test for different cities and weights
    Given the service is available
    And I send POST request to "/api/water-norm/calculate" with body:
      | field  | value   |
      | city   | <city>  |
      | weight | <weight>|
    Then response status is 200
    And recommended_norm_liters is <norm>

    Examples:
      | city        | weight | norm |
      | Moscow      | 50     | 1.5  |
      | Moscow      | 80     | 2.4  |
      | Sochi       | 60     | 2.3  |
      | Astrakhan   | 90     | 3.2  |
      | Novosibirsk | 100    | 3.0  |

  Scenario: Error for negative weight via API
    Given the service is available
    And I send POST request to "/api/water-norm/calculate" with body:
      | field  | value   |
      | city   | Moscow  |
      | weight | -50     |
    Then response status is 400
    And response success is false
    And error contains "Weight cannot be negative"

  Scenario: Error for too small weight via API
    Given the service is available
    And I send POST request to "/api/water-norm/calculate" with body:
      | field  | value   |
      | city   | Moscow  |
      | weight | 1       |
    Then response status is 400
    And error contains "minimum weight is 20 kg"

  Scenario: Error for too large weight via API
    Given the service is available
    And I send POST request to "/api/water-norm/calculate" with body:
      | field  | value   |
      | city   | Moscow  |
      | weight | 800     |
    Then response status is 400
    And error contains "maximum weight is 300 kg"

  Scenario: Error for city not selected via API
    Given the service is available
    And I send POST request to "/api/water-norm/calculate" with body:
      | field  | value   |
      | city   |         |
      | weight | 70      |
    Then response status is 400
    And error contains "Please select a city"