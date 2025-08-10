@route-printing @pest-control
Feature: Route Printing and Export
  As a pest control service specialist
  I want to print or export my assigned route information
  So that I can reference customer details and service requirements while in the field

  Background:
    Given I am logged into the HWPC system
    And I have routes assigned to me
    And I am on the route management page

  Scenario: Generate mobile-optimized printable route format
    Given I have selected a route for printing
    When I click the print route button
    Then the system should generate a mobile-optimized printable format
    And the format should be based on the original print preview layout
    And the print preview should display correctly

  Scenario: Include comprehensive route information in print
    Given I have selected a route with multiple stops
    When I generate the print preview
    Then the printed route should include customer addresses
    And the printed route should include contact information
    And the printed route should include service notes
    And the printed route should include special instructions
    And the information should match the legacy format structure

  Scenario: Export route data with multiple format options
    Given I have a route ready for export
    When I access the export options
    Then I should see PDF download option
    And I should see mobile-friendly format options
    When I select PDF export
    Then the system should generate a downloadable PDF file
    And the PDF should contain all route information

  Scenario: Display route stops in sequential order with clear formatting
    Given I have a route with multiple stops in specific order
    When I view the print preview
    Then the route stops should be displayed in sequential order
    And the formatting should be clear and readable
    And the visual structure should maintain the original design layout
    And each stop should be clearly separated

  Scenario: Optimize layout for mobile printing
    Given I am accessing the system from a mobile device
    When I print a route from my mobile device
    Then the layout should be optimized for mobile printing capabilities
    And essential information layout should be preserved
    And the print should be readable on mobile-sized paper
    And no critical information should be cut off

  Scenario: Log print actions for tracking
    Given I have a route ready to print
    When I complete the printing process
    Then the system should log the print action
    And the system should record the timestamp
    And the log should be available for tracking purposes
    And the log should include the user who printed the route

  Scenario: Handle print preview validation
    Given I am viewing a route print preview
    When I validate the print preview layout
    Then all customer information should be visible
    And all service details should be properly formatted
    And the layout should match the legacy print preview interface
    And no information should be truncated or missing

  Scenario: Export route data for offline access
    Given I need to access route information offline
    When I export the route data
    Then I should be able to download the route information
    And the exported data should be accessible without internet connection
    And the format should be suitable for mobile viewing
    And all critical route information should be included
