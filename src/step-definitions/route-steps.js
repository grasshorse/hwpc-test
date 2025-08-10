const { Given, When, Then } = require('@cucumber/cucumber');
const { RoutePage } = require('../support/page-objects/RoutePage');
const { expect } = require('chai');

// Page object instance
let routePage;

// Test data storage
let testRoute;
let testRoutes = [];
let testTickets = [];
let testCustomer;

// Navigation steps
Given('I am on the route planning page', async function () {
  routePage = new RoutePage(this.page);
  await routePage.navigateToRoutes();
});

Given('I have navigated to the routes page', async function () {
  routePage = new RoutePage(this.page);
  await routePage.navigateToRoutes();
});

// Route creation steps
When('I click the {string} button', async function (buttonText) {
  switch (buttonText.toLowerCase()) {
    case 'create new route':
    case 'create route':
      await routePage.clickCreateRoute();
      break;
    case 'save route':
      await routePage.saveRoute();
      break;
    case 'cancel':
      await routePage.clickCancel();
      break;
    case 'delete route':
      await routePage.clickDeleteRoute();
      break;
    case 'refresh routes':
      await routePage.refreshRoutes();
      break;
    case 'optimize all routes':
      await routePage.clickOptimizeAllRoutes();
      break;
    default:
      throw new Error(`Unknown button: ${buttonText}`);
  }
});

When('I fill in the route form with the following details:', async function (dataTable) {
  const routeData = dataTable.rowsHash();
  
  // Store test data for later verification
  testRoute = routeData;
  
  await routePage.fillRouteForm(routeData);
});

When('I enter {string} as the route name', async function (routeName) {
  await routePage.setRouteName(routeName);
  if (!testRoute) testRoute = {};
  testRoute.routeName = routeName;
});

When('I set the route date to {string}', async function (date) {
  await routePage.setRouteDate(date);
  if (!testRoute) testRoute = {};
  testRoute.routeDate = date;
});

When('I select {string} as the driver', async function (driver) {
  await routePage.selectDriver(driver);
  if (!testRoute) testRoute = {};
  testRoute.driver = driver;
});

When('I select {string} as the vehicle', async function (vehicle) {
  await routePage.selectVehicle(vehicle);
  if (!testRoute) testRoute = {};
  testRoute.vehicle = vehicle;
});

When('I set the start time to {string}', async function (startTime) {
  await routePage.setStartTime(startTime);
  if (!testRoute) testRoute = {};
  testRoute.startTime = startTime;
});

When('I set the end time to {string}', async function (endTime) {
  await routePage.setEndTime(endTime);
  if (!testRoute) testRoute = {};
  testRoute.endTime = endTime;
});

When('I enter {string} as route notes', async function (notes) {
  await routePage.setRouteNotes(notes);
  if (!testRoute) testRoute = {};
  testRoute.notes = notes;
});

// Route editing steps
When('I edit the route with ID {string}', async function (routeId) {
  await routePage.clickEditRoute(routeId);
});

When('I click the edit button for route {string}', async function (routeId) {
  await routePage.clickEditRoute(routeId);
});

When('I update the route name to {string}', async function (newRouteName) {
  await routePage.setRouteName(newRouteName);
  if (!testRoute) testRoute = {};
  testRoute.routeName = newRouteName;
});

When('I update the driver to {string}', async function (newDriver) {
  await routePage.selectDriver(newDriver);
  if (!testRoute) testRoute = {};
  testRoute.driver = newDriver;
});

When('I update the start time to {string}', async function (newStartTime) {
  await routePage.setStartTime(newStartTime);
  if (!testRoute) testRoute = {};
  testRoute.startTime = newStartTime;
});

// Route deletion steps
When('I delete the route with ID {string}', async function (routeId) {
  await routePage.deleteRoute(routeId, true);
});

When('I click the delete button for route {string}', async function (routeId) {
  await routePage.clickDeleteRoute(routeId);
});

When('I confirm the deletion', async function () {
  await routePage.confirmDelete();
});

When('I cancel the deletion', async function () {
  await routePage.cancelDelete();
});

// Ticket assignment steps
When('I assign ticket {string} to the route', async function (ticketId) {
  await routePage.assignTicketToRoute(ticketId);
});

When('I drag ticket {string} to the route', async function (ticketId) {
  await routePage.dragTicketToRoute(ticketId);
});

When('I remove ticket {string} from the route', async function (ticketId) {
  await routePage.removeTicketFromRoute(ticketId);
});

When('I reorder ticket {string} to position {int}', async function (ticketId, position) {
  await routePage.reorderTicketInRoute(ticketId, position);
});

When('I drag ticket {string} from unassigned to assigned tickets', async function (ticketId) {
  await routePage.dragTicketFromUnassignedToAssigned(ticketId);
});

When('I drag ticket {string} from assigned back to unassigned tickets', async function (ticketId) {
  await routePage.dragTicketFromAssignedToUnassigned(ticketId);
});

// Route planning steps
When('I click the plan route button for route {string}', async function (routeId) {
  await routePage.clickPlanRoute(routeId);
});

When('I open the route planning interface for route {string}', async function (routeId) {
  await routePage.openRoutePlanningInterface(routeId);
});

When('I view the route map', async function () {
  await routePage.viewRouteMap();
});

When('I optimize the route', async function () {
  await routePage.optimizeRoute();
});

When('I accept the route optimization', async function () {
  await routePage.acceptOptimization();
});

When('I reject the route optimization', async function () {
  await routePage.rejectOptimization();
});

// Search and filter steps
When('I search for routes with {string}', async function (searchTerm) {
  await routePage.searchRoutes(searchTerm);
});

When('I filter routes by {string}', async function (filterValue) {
  await routePage.filterRoutes(filterValue);
});

When('I sort routes by {string}', async function (sortValue) {
  await routePage.sortRoutes(sortValue);
});

// Mobile-specific steps
When('I tap on route {string}', async function (routeId) {
  await routePage.tapRouteCard(routeId);
});

When('I tap the mobile create route button', async function () {
  await routePage.clickMobileCreateRoute();
});

When('I open the mobile search', async function () {
  await routePage.openMobileSearch();
});

When('I open the mobile filter', async function () {
  await routePage.openMobileFilter();
});

When('I use mobile drag and drop for ticket {string}', async function (ticketId) {
  await routePage.mobileDragAndDropTicket(ticketId);
});

// Route printing steps
When('I click the print button for route {string}', async function (routeId) {
  await routePage.clickPrintRoute(routeId);
});

When('I export the route to PDF', async function () {
  await routePage.exportRouteToPDF();
});

When('I print the route', async function () {
  await routePage.printRoute();
});

// Verification steps
Then('the route should be created successfully', async function () {
  const successMessage = await routePage.getSuccessMessage();
  expect(successMessage).to.contain('route');
  expect(successMessage.toLowerCase()).to.contain('created');
});

Then('the route should be updated successfully', async function () {
  const successMessage = await routePage.getSuccessMessage();
  expect(successMessage).to.contain('route');
  expect(successMessage.toLowerCase()).to.contain('updated');
});

Then('the route should be deleted successfully', async function () {
  const successMessage = await routePage.getSuccessMessage();
  expect(successMessage).to.contain('route');
  expect(successMessage.toLowerCase()).to.contain('deleted');
});

Then('the route should appear in the route list', async function () {
  if (!testRoute || !testRoute.routeName) {
    throw new Error('No test route data available for verification');
  }
  
  const routes = await routePage.getAllRoutes();
  const foundRoute = routes.find(r => 
    r.routeName === testRoute.routeName
  );
  
  expect(foundRoute).to.not.be.undefined;
});

Then('the route with ID {string} should appear in the list', async function (routeId) {
  const routeExists = await routePage.routeExists(routeId);
  expect(routeExists).to.be.true;
});

Then('the route with ID {string} should not appear in the list', async function (routeId) {
  const routeExists = await routePage.routeExists(routeId);
  expect(routeExists).to.be.false;
});

Then('I should see the route details for {string}', async function (routeId) {
  const routeDetails = await routePage.getRouteDetails(routeId);
  expect(routeDetails).to.not.be.null;
  expect(routeDetails.id).to.equal(routeId);
});

Then('the route details should show:', async function (dataTable) {
  const expectedData = dataTable.rowsHash();
  
  if (!testRoute) {
    throw new Error('No test route data available for verification');
  }
  
  // Get the route ID from the last created route
  const routes = await routePage.getAllRoutes();
  const foundRoute = routes.find(r => 
    r.routeName === testRoute.routeName
  );
  
  if (!foundRoute) {
    throw new Error('Route not found in list');
  }
  
  const routeDetails = await routePage.getRouteDetails(foundRoute.id);
  
  for (const [field, expectedValue] of Object.entries(expectedData)) {
    const actualValue = routeDetails[field];
    expect(actualValue).to.equal(expectedValue, 
      `Expected ${field} to be '${expectedValue}' but got '${actualValue}'`);
  }
});

Then('I should see {int} route(s) in the list', async function (expectedCount) {
  const routes = await routePage.getAllRoutes();
  expect(routes.length).to.equal(expectedCount);
});

// Ticket assignment verification
Then('ticket {string} should be assigned to the route', async function (ticketId) {
  const isAssigned = await routePage.isTicketAssignedToRoute(ticketId);
  expect(isAssigned).to.be.true;
});

Then('ticket {string} should not be assigned to any route', async function (ticketId) {
  const isUnassigned = await routePage.isTicketUnassigned(ticketId);
  expect(isUnassigned).to.be.true;
});

Then('the route should contain {int} ticket(s)', async function (expectedCount) {
  if (!testRoute) {
    throw new Error('No test route data available for verification');
  }
  
  const routes = await routePage.getAllRoutes();
  const foundRoute = routes.find(r => 
    r.routeName === testRoute.routeName
  );
  
  expect(foundRoute).to.not.be.undefined;
  expect(parseInt(foundRoute.ticketCount)).to.equal(expectedCount);
});

Then('the tickets should be in the correct order:', async function (dataTable) {
  const expectedOrder = dataTable.raw().flat();
  const actualOrder = await routePage.getTicketOrder();
  
  expect(actualOrder).to.deep.equal(expectedOrder);
});

Then('ticket {string} should be at position {int} in the route', async function (ticketId, expectedPosition) {
  const actualPosition = await routePage.getTicketPosition(ticketId);
  expect(actualPosition).to.equal(expectedPosition);
});

// Route optimization verification
Then('the route should be optimized', async function () {
  const isOptimized = await routePage.isRouteOptimized();
  expect(isOptimized).to.be.true;
});

Then('I should see the optimization results', async function () {
  const hasOptimizationResults = await routePage.hasOptimizationResults();
  expect(hasOptimizationResults).to.be.true;
});

Then('the estimated travel time should be reduced', async function () {
  const optimizationResults = await routePage.getOptimizationResults();
  expect(optimizationResults.timeSaved).to.be.greaterThan(0);
});

Then('the route distance should be minimized', async function () {
  const optimizationResults = await routePage.getOptimizationResults();
  expect(optimizationResults.distanceSaved).to.be.greaterThan(0);
});

// Search and filter verification
Then('the search results should contain {string}', async function (searchTerm) {
  const routes = await routePage.getAllRoutes();
  const matchingRoutes = routes.filter(route => 
    route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (route.notes && route.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  expect(matchingRoutes.length).to.be.greaterThan(0);
});

Then('the filtered results should only show {string} routes', async function (filterType) {
  const routes = await routePage.getAllRoutes();
  
  switch (filterType.toLowerCase()) {
    case 'active':
      routes.forEach(route => {
        expect(route.status).to.equal('Active');
      });
      break;
    case 'completed':
      routes.forEach(route => {
        expect(route.status).to.equal('Completed');
      });
      break;
    case 'today':
      const today = new Date().toISOString().split('T')[0];
      routes.forEach(route => {
        expect(route.routeDate).to.equal(today);
      });
      break;
    default:
      throw new Error(`Unknown filter type: ${filterType}`);
  }
});

// Form validation steps
Then('I should see a validation error for {string}', async function (fieldName) {
  const hasError = await routePage.hasFieldError(fieldName);
  expect(hasError).to.be.true;
});

Then('I should see the validation message {string}', async function (expectedMessage) {
  const validationErrors = await routePage.getValidationErrors();
  const hasMessage = validationErrors.some(error => 
    error.message.includes(expectedMessage)
  );
  expect(hasMessage).to.be.true;
});

Then('the form should not be submitted', async function () {
  // Check that we're still on the form page
  const isOnForm = await routePage.isOnRouteForm();
  expect(isOnForm).to.be.true;
});

// Google Sheets integration verification
Then('the Google Sheets backend should contain the new route data', async function () {
  if (!testRoute) {
    throw new Error('No test route data available for verification');
  }
  
  // Use TestDataFactory to verify backend data
  const backendRoute = await TestDataFactory.getLatestRouteFromSheets();
  expect(backendRoute).to.not.be.null;
  expect(backendRoute.routeName).to.equal(testRoute.routeName);
  expect(backendRoute.createdBy).to.equal('usermvp@hwpc.net');
  expect(backendRoute.mvpTestData).to.be.true;
});

Then('the Google Sheets backend should reflect the updated route data', async function () {
  if (!testRoute) {
    throw new Error('No test route data available for verification');
  }
  
  const backendRoute = await TestDataFactory.getRouteFromSheets(testRoute.routeName);
  expect(backendRoute).to.not.be.null;
  
  // Verify updated fields
  for (const [field, value] of Object.entries(testRoute)) {
    if (backendRoute.hasOwnProperty(field)) {
      expect(backendRoute[field]).to.equal(value);
    }
  }
});

Then('the Google Sheets backend should no longer contain the route data', async function () {
  if (!testRoute) {
    throw new Error('No test route data available for verification');
  }
  
  const backendRoute = await TestDataFactory.getRouteFromSheets(testRoute.routeName);
  expect(backendRoute).to.be.null;
});

// Mobile responsive verification
Then('the route planning interface should be mobile-optimized', async function () {
  const isMobileView = await routePage.isMobileView();
  expect(isMobileView).to.be.true;
  
  const hasMobileElements = await routePage.hasMobileRouteElements();
  expect(hasMobileElements).to.be.true;
});

Then('drag and drop should work on mobile devices', async function () {
  const isMobileView = await routePage.isMobileView();
  expect(isMobileView).to.be.true;
  
  const supportsMobileDragDrop = await routePage.supportsMobileDragDrop();
  expect(supportsMobileDragDrop).to.be.true;
});

Then('the interface should be touch-friendly', async function () {
  const touchElements = await routePage.getTouchFriendlyElements();
  
  // Verify touch targets are appropriately sized
  for (const element of touchElements) {
    expect(element.width).to.be.at.least(44); // Minimum touch target size
    expect(element.height).to.be.at.least(44);
  }
});

// Route printing verification
Then('the print preview should be displayed', async function () {
  const hasPrintPreview = await routePage.hasPrintPreview();
  expect(hasPrintPreview).to.be.true;
});

Then('the route should be exported as PDF', async function () {
  const pdfExported = await routePage.isPDFExported();
  expect(pdfExported).to.be.true;
});

Then('the printed route should match the legacy Delphi interface layout', async function () {
  const layoutMatches = await routePage.doesPrintLayoutMatchLegacy();
  expect(layoutMatches).to.be.true;
});

// Test data setup and cleanup steps
Given('I have a test route with the following details:', async function (dataTable) {
  const routeData = dataTable.rowsHash();
  testRoute = await TestDataFactory.createTestRoute(routeData);
  testRoutes.push(testRoute);
});

Given('I have {int} test routes in the system', async function (count) {
  testRoutes = [];
  for (let i = 0; i < count; i++) {
    const route = await TestDataFactory.createTestRoute({
      routeName: `Test Route ${i + 1}`,
      routeDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      driver: `Test Driver ${i + 1}`
    });
    testRoutes.push(route);
  }
});

Given('I have unassigned tickets available for route planning', async function () {
  // Create test customer first
  if (!testCustomer) {
    testCustomer = await TestDataFactory.createTestCustomer({
      companyName: 'Test Customer for Route Planning'
    });
  }
  
  // Create several unassigned tickets
  testTickets = [];
  for (let i = 0; i < 3; i++) {
    const ticket = await TestDataFactory.createTestTicket({
      customerId: testCustomer.customerId,
      serviceType: `Route Test Service ${i + 1}`,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending'
    });
    testTickets.push(ticket);
  }
});

Given('I have a route with ID {string} in the system', async function (routeId) {
  testRoute = await TestDataFactory.createTestRoute({
    routeId: routeId,
    routeName: 'Test Route for ' + routeId,
    routeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    driver: 'Test Driver'
  });
  testRoutes.push(testRoute);
});

// Error handling steps
Then('I should see an error message', async function () {
  const errorMessage = await routePage.getErrorMessage();
  expect(errorMessage).to.not.be.null;
  expect(errorMessage.length).to.be.greaterThan(0);
});

Then('I should see the error message {string}', async function (expectedError) {
  const errorMessage = await routePage.getErrorMessage();
  expect(errorMessage).to.contain(expectedError);
});

// Cleanup hook for test data
const { After } = require('@cucumber/cucumber');

After({ tags: '@route-planning' }, async function () {
  // Clean up test routes created during the scenario
  if (testRoutes.length > 0) {
    try {
      for (const route of testRoutes) {
        await TestDataFactory.deleteTestRoute(route.routeId);
      }
      console.log(`Cleaned up ${testRoutes.length} test routes`);
    } catch (error) {
      console.warn('Failed to clean up some test routes:', error.message);
    }
    testRoutes = [];
  }
  
  // Clean up test tickets
  if (testTickets.length > 0) {
    try {
      for (const ticket of testTickets) {
        await TestDataFactory.deleteTestTicket(ticket.ticketId);
      }
      console.log(`Cleaned up ${testTickets.length} test tickets`);
    } catch (error) {
      console.warn('Failed to clean up some test tickets:', error.message);
    }
    testTickets = [];
  }
  
  // Clean up test customer
  if (testCustomer) {
    try {
      await TestDataFactory.deleteTestCustomer(testCustomer.customerId);
      console.log('Cleaned up test customer');
    } catch (error) {
      console.warn('Failed to clean up test customer:', error.message);
    }
    testCustomer = null;
  }
  
  // Reset test route data
  testRoute = null;
});