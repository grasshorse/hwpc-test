Feature: MVP Mock Authentication
  As a QA engineer testing the MVP
  I want to use mock authentication with usermvp@hwpc.net
  So that I can test core workflows without implementing complex Google authentication

  Background:
    Given I am authenticated as MVP user "usermvp@hwpc.net"

  @mvp @authentication
  Scenario: Verify MVP user authentication
    When I verify my authentication status
    Then I should be authenticated as "usermvp@hwpc.net"
    And I should have "read" permission
    And I should have "write" permission
    And I should have "delete" permission
    And I should have "admin" permission

  @mvp @authentication
  Scenario: MVP user can access protected features
    Given I am logged in as the MVP test user
    When I navigate to the dashboard
    Then I should see the main navigation menu
    And I should see my user name "MVP Test User" in the header
    And I should have access to all administrative functions

  @mvp @data-creation
  Scenario: Test data is properly attributed to MVP user
    Given I am logged in as the MVP test user
    When I create a new test customer
    Then the customer should be marked as created by "usermvp@hwpc.net"
    And the customer should have the "mvpTestData" flag set to true
    And the customer should be easily identifiable as test data