@ticket-management @hwpc
Feature: Ticket Management System
  As a pest control service specialist
  I want to create, view, update, and delete service tickets
  So that I can track all service requests and their completion status

  Background:
    Given I am authenticated as MVP user "usermvp@hwpc.net"
    And I have access to the ticket management interface

  @crud @smoke @desktop
  Scenario: Create a new service ticket
    Given I am on the ticket management page
    When I click the "Create New Ticket" button
    And I select customer "ABC Pest Control Inc"
    And I select service type "Monthly Treatment"
    And I set the scheduled date to "2024-03-15"
    And I set the scheduled time to "09:00"
    And I set the priority to "High"
    And I enter service notes "Initial treatment for ant infestation"
    And I set estimated duration to "60" minutes
    And I click "Save Ticket"
    Then the ticket should be created successfully
    And I should see a success message "Ticket created successfully"
    And the ticket should appear in the ticket list
    And the ticket status should be "Pending"
    And the Google Sheets backend should contain the new ticket data
    And the ticket should be marked as created by "usermvp@hwpc.net"

  @crud @desktop
  Scenario: View ticket details
    Given I have a ticket with ID "TKT-001" in the system
    And I am on the ticket management page
    When I click on ticket "TKT-001"
    Then I should see the ticket detail view
    And I should see customer information
    And I should see service type "Monthly Treatment"
    And I should see scheduled date and time
    And I should see priority level
    And I should see service notes
    And I should see ticket status
    And I should see creation and modification timestamps

  @crud @desktop
  Scenario: Update existing ticket information
    Given I have a ticket with ID "TKT-002" in the system
    And I am on the ticket management page
    When I click on ticket "TKT-002"
    And I click the "Edit Ticket" button
    And I update the priority to "Medium"
    And I update the scheduled time to "14:00"
    And I update service notes to "Updated: Customer requested afternoon appointment"
    And I click "Save Changes"
    Then the ticket should be updated successfully
    And I should see a success message "Ticket updated successfully"
    And the updated information should be displayed
    And the Google Sheets backend should reflect the changes
    And the last modified timestamp should be updated

  @crud @desktop
  Scenario: Delete ticket record
    Given I have a ticket with ID "TKT-DELETE-TEST" in the system
    And I am on the ticket management page
    When I click on ticket "TKT-DELETE-TEST"
    And I click the "Delete Ticket" button
    And I confirm the deletion in the confirmation dialog
    Then the ticket should be deleted successfully
    And I should see a success message "Ticket deleted successfully"
    And the ticket should no longer appear in the ticket list
    And the ticket should be marked as deleted in Google Sheets backend

  @crud @desktop
  Scenario: Update ticket status
    Given I have a ticket with ID "TKT-STATUS-TEST" with status "Pending" in the system
    And I am on the ticket management page
    When I click on ticket "TKT-STATUS-TEST"
    And I click the "Update Status" button
    And I select status "In Progress"
    And I enter completion notes "Started treatment, customer present"
    And I click "Update Status"
    Then the ticket status should be updated to "In Progress"
    And I should see a success message "Ticket status updated successfully"
    And the status change should be reflected in the ticket list
    And the Google Sheets backend should contain the status update
    And the status change timestamp should be recorded

  @crud @desktop
  Scenario: Complete ticket with service report
    Given I have a ticket with ID "TKT-COMPLETE-TEST" with status "In Progress" in the system
    And I am on the ticket management page
    When I click on ticket "TKT-COMPLETE-TEST"
    And I click the "Complete Ticket" button
    And I enter completion notes "Treatment completed successfully. No issues found."
    And I set actual duration to "45" minutes
    And I upload service completion photo
    And I click "Mark Complete"
    Then the ticket status should be updated to "Completed"
    And I should see a success message "Ticket completed successfully"
    And the completion details should be saved
    And the Google Sheets backend should contain the completion data
    And the completion timestamp should be recorded

  @search @desktop
  Scenario: Search tickets by customer name
    Given I have tickets for customers "Alpha Corp", "Beta LLC", and "Gamma Inc" in the system
    And I am on the ticket management page
    When I enter "Beta" in the ticket search field
    And I click the search button
    Then I should see only tickets for customers matching "Beta"
    And I should see tickets for "Beta LLC" in the search results
    And I should not see tickets for "Alpha Corp" or "Gamma Inc"

  @search @desktop
  Scenario: Filter tickets by status
    Given I have tickets with different statuses in the system
    And I am on the ticket management page
    When I click the filter button
    And I select status filter "Pending"
    And I apply the filter
    Then I should see only tickets with "Pending" status
    And the ticket count should reflect the filtered results

  @search @desktop
  Scenario: Filter tickets by date range
    Given I have tickets scheduled for different dates in the system
    And I am on the ticket management page
    When I click the filter button
    And I set date range from "2024-03-01" to "2024-03-31"
    And I apply the filter
    Then I should see only tickets scheduled within the date range
    And the ticket count should reflect the filtered results

  @search @desktop
  Scenario: Filter tickets by priority
    Given I have tickets with different priorities in the system
    And I am on the ticket management page
    When I click the filter button
    And I select priority filter "High"
    And I apply the filter
    Then I should see only tickets with "High" priority
    And the ticket count should reflect the filtered results

  @validation @desktop
  Scenario: Validate required fields when creating ticket
    Given I am on the ticket management page
    When I click the "Create New Ticket" button
    And I leave the customer field empty
    And I leave the service type field empty
    And I leave the scheduled date field empty
    And I click "Save Ticket"
    Then I should see validation errors
    And I should see error message "Customer is required"
    And I should see error message "Service type is required"
    And I should see error message "Scheduled date is required"
    And the ticket should not be created
    And no data should be sent to Google Sheets

  @validation @desktop
  Scenario: Validate scheduled date is not in the past
    Given I am on the ticket management page
    When I click the "Create New Ticket" button
    And I select customer "Test Customer"
    And I select service type "Monthly Treatment"
    And I set the scheduled date to "2023-01-01"
    And I click "Save Ticket"
    Then I should see validation error "Scheduled date cannot be in the past"
    And the ticket should not be created

  @validation @desktop
  Scenario: Validate estimated duration is reasonable
    Given I am on the ticket management page
    When I click the "Create New Ticket" button
    And I select customer "Test Customer"
    And I select service type "Monthly Treatment"
    And I set the scheduled date to "2024-03-15"
    And I set estimated duration to "999" minutes
    And I click "Save Ticket"
    Then I should see validation error "Estimated duration must be between 15 and 480 minutes"
    And the ticket should not be created

  @mobile @responsive @crud
  Scenario: Create ticket on mobile device
    Given I am using a mobile device with screen size "375x667"
    And I am on the ticket management page
    When I tap the "Create New Ticket" button
    And I select customer "Mobile Test Corp"
    And I select service type "Quarterly Treatment"
    And I set the scheduled date to "2024-03-20"
    And I scroll down to see more fields
    And I set the scheduled time to "10:00"
    And I set the priority to "Medium"
    And I enter service notes "Mobile created ticket"
    And I tap "Save Ticket"
    Then the ticket should be created successfully
    And I should see a mobile-optimized success message
    And the ticket should appear in the mobile ticket list
    And all form fields should be touch-friendly
    And the interface should be responsive

  @mobile @responsive @touch
  Scenario: Navigate ticket list on mobile with touch gestures
    Given I am using a mobile device with screen size "375x667"
    And I have multiple tickets in the system
    And I am on the ticket management page
    When I scroll down through the ticket list
    And I tap on a ticket card
    Then the ticket details should open in mobile view
    And all ticket information should be readable
    And action buttons should be appropriately sized for touch
    And I should be able to swipe back to the ticket list

  @mobile @responsive @search
  Scenario: Search tickets on mobile device
    Given I am using a mobile device with screen size "375x667"
    And I have tickets for customers "Mobile Corp A", "Mobile Corp B", and "Desktop Inc" in the system
    And I am on the ticket management page
    When I tap the search icon
    And I enter "Mobile" in the search field using mobile keyboard
    And I tap the search button
    Then I should see mobile-optimized search results
    And I should see tickets for "Mobile Corp A" and "Mobile Corp B"
    And the search interface should be touch-friendly

  @mobile @responsive @edit
  Scenario: Edit ticket on mobile device
    Given I am using a mobile device with screen size "375x667"
    And I have a ticket with ID "TKT-MOBILE-EDIT" in the system
    And I am on the ticket management page
    When I tap on ticket "TKT-MOBILE-EDIT"
    And I tap the "Edit" button
    And I update the priority using mobile interface
    And I scroll to see the save button
    And I tap "Save Changes"
    Then the ticket should be updated successfully
    And I should see mobile-optimized confirmation
    And the updated information should be displayed correctly

  @mobile @responsive @status
  Scenario: Update ticket status on mobile device
    Given I am using a mobile device with screen size "375x667"
    And I have a ticket with ID "TKT-MOBILE-STATUS" with status "Pending" in the system
    And I am on the ticket management page
    When I tap on ticket "TKT-MOBILE-STATUS"
    And I tap the "Update Status" button
    And I select status "In Progress" using mobile interface
    And I enter completion notes using mobile keyboard
    And I tap "Update Status"
    Then the ticket status should be updated to "In Progress"
    And I should see mobile-optimized status confirmation
    And the status change should be visible in mobile ticket list

  @google-sheets @integration @desktop
  Scenario: Verify ticket data synchronization with Google Sheets
    Given I am on the ticket management page
    When I create a new ticket for customer "Sheets Sync Test Corp"
    Then the ticket data should be immediately available in Google Sheets
    And the Google Sheets row should contain all ticket fields
    And the created timestamp should match the UI creation time
    And the created by field should be "usermvp@hwpc.net"

  @google-sheets @integration @desktop
  Scenario: Verify ticket update synchronization
    Given I have a ticket with ID "TKT-SHEETS-UPDATE" in the system
    And the ticket exists in Google Sheets
    When I update the ticket's priority and service notes
    Then the Google Sheets data should be updated within 5 seconds
    And the modified timestamp should be updated in Google Sheets
    And the modified by field should be "usermvp@hwpc.net"

  @google-sheets @integration @desktop
  Scenario: Verify ticket status change synchronization
    Given I have a ticket with ID "TKT-STATUS-SYNC" with status "Pending" in the system
    And the ticket exists in Google Sheets
    When I update the ticket status to "Completed"
    Then the Google Sheets status field should be updated within 5 seconds
    And the status change timestamp should be recorded in Google Sheets
    And the status changed by field should be "usermvp@hwpc.net"

  @google-sheets @integration @desktop
  Scenario: Handle Google Sheets connection errors gracefully
    Given Google Sheets API is temporarily unavailable
    And I am on the ticket management page
    When I try to create a new ticket for "Error Test Corp"
    Then I should see an error message "Unable to save ticket data. Please try again."
    And the ticket should not appear in the local list
    And I should have the option to retry the operation

  @data-validation @google-sheets @desktop
  Scenario: Prevent duplicate ticket creation for same customer and date
    Given I have a ticket for customer "Duplicate Test Corp" scheduled for "2024-03-15" in the system
    And I am on the ticket management page
    When I try to create another ticket for "Duplicate Test Corp" on "2024-03-15"
    And I click "Save Ticket"
    Then I should see validation error "A ticket already exists for this customer on this date"
    And the duplicate ticket should not be created
    And no duplicate entry should be added to Google Sheets

  @performance @desktop
  Scenario: Ticket list loads efficiently with large dataset
    Given I have 1000+ tickets in the system
    And I am on the ticket management page
    When the ticket list loads
    Then the page should load within 3 seconds
    And I should see the first 50 tickets
    And pagination controls should be available
    And search functionality should remain responsive

  @accessibility @desktop
  Scenario: Ticket management interface is accessible
    Given I am on the ticket management page
    When I navigate using only keyboard controls
    Then all interactive elements should be keyboard accessible
    And form fields should have proper labels
    And error messages should be announced by screen readers
    And the interface should meet WCAG 2.1 AA standards

  @mvp @test-data
  Scenario: Test ticket data is properly identified
    Given I am authenticated as MVP user "usermvp@hwpc.net"
    And I am on the ticket management page
    When I create a new ticket for customer "MVP Test Customer"
    Then the ticket should be marked as created by "usermvp@hwpc.net"
    And the ticket should have the "mvpTestData" flag set to true
    And the ticket should be easily identifiable as test data
    And the ticket should have a test data prefix in Google Sheets

  @workflow @desktop
  Scenario: Complete ticket workflow from creation to completion
    Given I am on the ticket management page
    When I create a new ticket for customer "Workflow Test Corp"
    And I set the service type to "Monthly Treatment"
    And I set the scheduled date to "2024-03-15"
    And I save the ticket
    Then the ticket should be created with status "Pending"
    When I update the ticket status to "In Progress"
    Then the ticket status should change to "In Progress"
    When I complete the ticket with service notes
    Then the ticket status should change to "Completed"
    And all status changes should be recorded in Google Sheets
    And the complete workflow should be auditable

  @workflow @mobile
  Scenario: Complete ticket workflow on mobile device
    Given I am using a mobile device with screen size "375x667"
    And I am on the ticket management page
    When I create a new ticket for customer "Mobile Workflow Corp" using mobile interface
    And I set all required fields using touch interactions
    And I save the ticket
    Then the ticket should be created with status "Pending"
    When I update the ticket status to "In Progress" using mobile interface
    Then the ticket status should change to "In Progress"
    When I complete the ticket using mobile interface
    Then the ticket status should change to "Completed"
    And the mobile workflow should be fully functional

  @reporting @desktop
  Scenario: Generate ticket summary report
    Given I have tickets with various statuses in the system
    And I am on the ticket management page
    When I click the "Generate Report" button
    And I select report type "Summary Report"
    And I set date range for the report
    And I click "Generate"
    Then I should see a summary report with ticket counts by status
    And I should see total tickets created in the date range
    And I should see average completion time
    And the report should be exportable to PDF

  @integration @customer-tickets
  Scenario: View customer's ticket history
    Given I have a customer "History Test Corp" with multiple tickets in the system
    And I am on the customer management page
    When I click on customer "History Test Corp"
    And I click the "View Tickets" tab
    Then I should see all tickets for this customer
    And I should see ticket statuses and dates
    And I should be able to click on any ticket to view details
    And I should see the complete service history for the customer