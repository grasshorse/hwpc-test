@route-planning @hwpc
Feature: Route Planning and Organization
  As a pest control route coordinator
  I want to organize tickets into efficient service routes
  So that service specialists can complete their assignments in an optimal sequence

  Background:
    Given I am authenticated as MVP user "usermvp@hwpc.net"
    And I have access to the route planning interface

  @crud @smoke @desktop
  Scenario: Create a new service route
    Given I am on the route planning page
    And I have unassigned tickets available for scheduling
    When I click the "Create New Route" button
    And I enter route name "Route A - North District"
    And I select route date "2024-03-15"
    And I assign service specialist "John Smith"
    And I drag ticket "TKT-001" to the route
    And I drag ticket "TKT-002" to the route
    And I click "Save Route"
    Then the route should be created successfully
    And I should see a success message "Route created successfully"
    And the route should appear in the route list
    And the assigned tickets should show route assignment
    And the Google Sheets backend should contain the new route data
    And the route should be marked as created by "usermvp@hwpc.net"

  @crud @desktop
  Scenario: View route details and stops
    Given I have a route "Route B - South District" with assigned tickets in the system
    And I am on the route planning page
    When I click on route "Route B - South District"
    Then I should see the route detail view
    And I should see route name "Route B - South District"
    And I should see assigned service specialist
    And I should see route date and estimated duration
    And I should see sequential order of stops
    And I should see customer information for each stop
    And I should see service notes and special instructions
    And I should see estimated travel time between stops

  @crud @desktop
  Scenario: Update route information and assignments
    Given I have a route "Route C - East District" with tickets in the system
    And I am on the route planning page
    When I click on route "Route C - East District"
    And I click the "Edit Route" button
    And I update the route name to "Route C - East District Updated"
    And I change the assigned specialist to "Jane Doe"
    And I drag ticket "TKT-005" from unassigned to the route
    And I reorder stops by dragging "TKT-003" above "TKT-004"
    And I click "Save Changes"
    Then the route should be updated successfully
    And I should see a success message "Route updated successfully"
    And the updated information should be displayed
    And the Google Sheets backend should reflect the changes
    And the last modified timestamp should be updated

  @crud @desktop
  Scenario: Delete route and reassign tickets
    Given I have a route "Route Delete Test" with assigned tickets in the system
    And I am on the route planning page
    When I click on route "Route Delete Test"
    And I click the "Delete Route" button
    And I confirm the deletion in the confirmation dialog
    Then the route should be deleted successfully
    And I should see a success message "Route deleted successfully"
    And the route should no longer appear in the route list
    And the previously assigned tickets should return to unassigned status
    And the route should be marked as deleted in Google Sheets backend

  @organization @desktop
  Scenario: Filter tickets by date for route planning
    Given I have tickets scheduled for different dates in the system
    And I am on the route planning page
    When I click the "Filter Tickets" button
    And I set date filter to "2024-03-15"
    And I apply the filter
    Then I should see only tickets scheduled for "2024-03-15"
    And the unassigned tickets panel should show filtered results
    And the ticket count should reflect the filtered results

  @organization @desktop
  Scenario: Filter tickets by location for route planning
    Given I have tickets for customers in different locations in the system
    And I am on the route planning page
    When I click the "Filter Tickets" button
    And I set location filter to "North District"
    And I apply the filter
    Then I should see only tickets for customers in "North District"
    And the tickets should be grouped by proximity
    And location-based suggestions should be available

  @organization @desktop
  Scenario: Filter tickets by priority for route planning
    Given I have tickets with different priority levels in the system
    And I am on the route planning page
    When I click the "Filter Tickets" button
    And I select priority filter "High"
    And I apply the filter
    Then I should see only tickets with "High" priority
    And high priority tickets should be visually highlighted
    And priority-based routing suggestions should be provided

  @organization @desktop
  Scenario: Filter tickets by service type for route planning
    Given I have tickets with different service types in the system
    And I am on the route planning page
    When I click the "Filter Tickets" button
    And I select service type filter "Monthly Treatment"
    And I apply the filter
    Then I should see only tickets with "Monthly Treatment" service type
    And service type compatibility should be indicated
    And estimated service duration should be displayed

  @drag-drop @desktop
  Scenario: Assign tickets to route using drag and drop
    Given I am on the route planning page
    And I have a route "Route D - West District" created
    And I have unassigned tickets "TKT-010", "TKT-011", "TKT-012" available
    When I drag ticket "TKT-010" from unassigned to "Route D - West District"
    And I drag ticket "TKT-011" from unassigned to "Route D - West District"
    And I drag ticket "TKT-012" from unassigned to "Route D - West District"
    Then the tickets should be assigned to the route
    And the tickets should appear in the route's stop list
    And the route estimated duration should be updated
    And the ticket statuses should change to "Assigned"
    And the Google Sheets backend should reflect the assignments

  @drag-drop @desktop
  Scenario: Reorder route stops using drag and drop
    Given I have a route "Route E - Central" with tickets "TKT-020", "TKT-021", "TKT-022" in the system
    And I am on the route planning page
    When I click on route "Route E - Central"
    And I drag stop "TKT-022" to the first position
    And I drag stop "TKT-020" to the last position
    Then the route stops should be reordered
    And the new sequence should be "TKT-022", "TKT-021", "TKT-020"
    And the estimated travel time should be recalculated
    And the Google Sheets backend should reflect the new order

  @optimization @desktop
  Scenario: Calculate route efficiency and travel time
    Given I have a route "Route F - Efficiency Test" with multiple stops in the system
    And I am on the route planning page
    When I click on route "Route F - Efficiency Test"
    And I click the "Calculate Route Efficiency" button
    Then I should see estimated total travel time
    And I should see estimated total service time
    And I should see route efficiency score
    And I should see suggested optimizations if available
    And travel time between consecutive stops should be displayed

  @optimization @desktop
  Scenario: Optimize route stop order automatically
    Given I have a route "Route G - Auto Optimize" with unoptimized stops in the system
    And I am on the route planning page
    When I click on route "Route G - Auto Optimize"
    And I click the "Optimize Route" button
    And I confirm the optimization
    Then the stops should be reordered for optimal efficiency
    And I should see improved route efficiency score
    And I should see reduced total travel time
    And the optimized order should be saved to Google Sheets

  @validation @desktop
  Scenario: Validate required fields when creating route
    Given I am on the route planning page
    When I click the "Create New Route" button
    And I leave the route name field empty
    And I leave the route date field empty
    And I leave the assigned specialist field empty
    And I click "Save Route"
    Then I should see validation errors
    And I should see error message "Route name is required"
    And I should see error message "Route date is required"
    And I should see error message "Assigned specialist is required"
    And the route should not be created
    And no data should be sent to Google Sheets

  @validation @desktop
  Scenario: Validate route date is not in the past
    Given I am on the route planning page
    When I click the "Create New Route" button
    And I enter route name "Past Date Test Route"
    And I set the route date to "2023-01-01"
    And I assign service specialist "Test Specialist"
    And I click "Save Route"
    Then I should see validation error "Route date cannot be in the past"
    And the route should not be created

  @validation @desktop
  Scenario: Prevent duplicate route assignments for same specialist and date
    Given I have a route for specialist "John Smith" on "2024-03-15" in the system
    And I am on the route planning page
    When I try to create another route for "John Smith" on "2024-03-15"
    And I click "Save Route"
    Then I should see validation error "Specialist already has a route assigned for this date"
    And the duplicate route should not be created
    And no duplicate entry should be added to Google Sheets

  @mobile @responsive @touch
  Scenario: Create route on mobile device using touch
    Given I am using a mobile device with screen size "375x667"
    And I am on the route planning page
    When I tap the "Create New Route" button
    And I enter route name "Mobile Route Test"
    And I select route date "2024-03-20"
    And I select assigned specialist "Mobile Specialist"
    And I scroll down to see available tickets
    And I tap and hold ticket "TKT-030" and drag to route area
    And I tap and hold ticket "TKT-031" and drag to route area
    And I tap "Save Route"
    Then the route should be created successfully
    And I should see a mobile-optimized success message
    And the route should appear in the mobile route list
    And all touch interactions should be responsive
    And the interface should be touch-friendly

  @mobile @responsive @touch
  Scenario: Reorder route stops on mobile using touch gestures
    Given I am using a mobile device with screen size "375x667"
    And I have a route "Mobile Route Reorder" with multiple stops in the system
    And I am on the route planning page
    When I tap on route "Mobile Route Reorder"
    And I tap and hold the first stop
    And I drag it to the third position using touch gesture
    And I release the touch
    Then the route stops should be reordered
    And I should see mobile-optimized reorder confirmation
    And the new order should be saved
    And touch feedback should be provided during the interaction

  @mobile @responsive @filter
  Scenario: Filter tickets on mobile device
    Given I am using a mobile device with screen size "375x667"
    And I have tickets with different attributes in the system
    And I am on the route planning page
    When I tap the filter icon
    And I select date filter using mobile date picker
    And I select priority filter using mobile dropdown
    And I tap "Apply Filters"
    Then I should see mobile-optimized filtered results
    And the filter interface should be touch-friendly
    And filtered tickets should be clearly displayed

  @google-sheets @integration @desktop
  Scenario: Verify route data synchronization with Google Sheets
    Given I am on the route planning page
    When I create a new route "Sheets Sync Test Route"
    And I assign tickets to the route
    Then the route data should be immediately available in Google Sheets
    And the Google Sheets row should contain all route fields
    And assigned tickets should show route ID in Google Sheets
    And the created timestamp should match the UI creation time
    And the created by field should be "usermvp@hwpc.net"

  @google-sheets @integration @desktop
  Scenario: Verify route update synchronization
    Given I have a route "Sheets Update Test Route" in the system
    And the route exists in Google Sheets
    When I update the route's specialist assignment and stop order
    Then the Google Sheets data should be updated within 5 seconds
    And the modified timestamp should be updated in Google Sheets
    And the modified by field should be "usermvp@hwpc.net"
    And ticket assignments should be updated in Google Sheets

  @google-sheets @integration @desktop
  Scenario: Handle Google Sheets connection errors gracefully
    Given Google Sheets API is temporarily unavailable
    And I am on the route planning page
    When I try to create a new route "Error Test Route"
    Then I should see an error message "Unable to save route data. Please try again."
    And the route should not appear in the local list
    And I should have the option to retry the operation
    And ticket assignments should not be affected

  @performance @desktop
  Scenario: Route planning interface loads efficiently with large dataset
    Given I have 200+ tickets and 50+ routes in the system
    And I am on the route planning page
    When the route planning interface loads
    Then the page should load within 5 seconds
    And I should see the first 20 routes
    And pagination controls should be available
    And drag and drop functionality should remain responsive
    And filtering should work efficiently with large datasets

  @accessibility @desktop
  Scenario: Route planning interface is accessible
    Given I am on the route planning page
    When I navigate using only keyboard controls
    Then all interactive elements should be keyboard accessible
    And drag and drop should have keyboard alternatives
    And route information should be announced by screen readers
    And the interface should meet WCAG 2.1 AA standards
    And focus indicators should be clearly visible

  @mvp @test-data
  Scenario: Test route data is properly identified
    Given I am authenticated as MVP user "usermvp@hwpc.net"
    And I am on the route planning page
    When I create a new route "MVP Test Route"
    Then the route should be marked as created by "usermvp@hwpc.net"
    And the route should have the "mvpTestData" flag set to true
    And the route should be easily identifiable as test data
    And the route should have a test data prefix in Google Sheets

  @workflow @desktop
  Scenario: Complete route planning workflow from creation to assignment
    Given I am on the route planning page
    When I create a new route "Workflow Test Route"
    And I set the route date to "2024-03-15"
    And I assign specialist "Workflow Specialist"
    And I save the route
    Then the route should be created successfully
    When I assign multiple tickets to the route
    Then the tickets should be assigned and ordered
    When I optimize the route order
    Then the route should be optimized for efficiency
    And all changes should be recorded in Google Sheets
    And the complete workflow should be auditable

  @integration @route-tickets
  Scenario: View ticket details from route planning interface
    Given I have a route "Integration Test Route" with assigned tickets in the system
    And I am on the route planning page
    When I click on route "Integration Test Route"
    And I click on ticket "TKT-100" within the route
    Then I should see the ticket detail popup
    And I should see customer information
    And I should see service requirements
    And I should see special instructions
    And I should be able to edit ticket details from the route context

  @reporting @desktop
  Scenario: Generate route efficiency report
    Given I have multiple routes with different efficiency scores in the system
    And I am on the route planning page
    When I click the "Generate Report" button
    And I select report type "Route Efficiency Report"
    And I set date range for the report
    And I click "Generate"
    Then I should see a report with route efficiency metrics
    And I should see average travel time per route
    And I should see specialist productivity metrics
    And the report should be exportable to PDF