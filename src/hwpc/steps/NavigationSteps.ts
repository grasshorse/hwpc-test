import { Given, Then, When } from "@cucumber/cucumber";
import NavigationPage from "../pages/NavigationPage";
import NavigationConstants from "../constants/NavigationConstants";

/**
 * NavigationSteps - Core navigation step definitions for HWPC application
 * Provides mobile-first navigation testing with comprehensive page validation
 */

// ===== CORE NAVIGATION STEP DEFINITIONS =====

/**
 * Given step: Navigate to base URL and verify initial page load
 * Requirements: 3.1 - Support "Given user is on baseurl" step
 */
Given('user is on baseurl', async function () {
    try {
        console.log('Navigating to base URL...');
        
        const navigationPage = new NavigationPage(this.web);
        await navigationPage.initialize();
        
        // Navigate to base URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        await this.web.getPage().goto(baseUrl);
        
        // Wait for page load with mobile-first timeout
        const viewportCategory = await navigationPage.getCurrentViewportCategory();
        const timeout = NavigationConstants.getTimeout(viewportCategory, 'pageLoad');
        await this.web.getPage().waitForLoadState('networkidle', { timeout });
        
        // Verify basic page elements are present
        await navigationPage.waitForLoadingComplete();
        
        console.log('Successfully navigated to base URL and verified page load');
        
    } catch (error) {
        console.error('Failed to navigate to base URL:', error.message);
        throw new Error(`Base URL navigation failed: ${error.message}`);
    }
});

/**
 * When step: Click on navigation link with mobile-first logic
 * Requirements: 3.2 - Support "When the user clicks [page]" step for all navigation pages
 */
When('the user clicks {string}', async function (pageName: string) {
    try {
        console.log(`User clicking on ${pageName} navigation...`);
        
        const navigationPage = new NavigationPage(this.web);
        
        // Validate page name is supported
        const supportedPages = NavigationConstants.getPageNames();
        const normalizedPageName = pageName.toLowerCase();
        
        if (!supportedPages.includes(normalizedPageName)) {
            throw new Error(`Unsupported page name: ${pageName}. Supported pages: ${supportedPages.join(', ')}`);
        }
        
        // Navigate to the specified page with mobile-first approach
        await navigationPage.navigateToPage(normalizedPageName);
        
        console.log(`Successfully clicked and navigated to ${pageName}`);
        
    } catch (error) {
        console.error(`Failed to click ${pageName} navigation:`, error.message);
        throw new Error(`Navigation click failed for ${pageName}: ${error.message}`);
    }
});

/**
 * Then step: Verify user is on the specified page with comprehensive validation
 * Requirements: 3.3 - Support "Then user should be on [page]" step with proper page validation
 */
Then('user should be on {string}', async function (pageName: string) {
    try {
        console.log(`Verifying user is on ${pageName} page...`);
        
        const navigationPage = new NavigationPage(this.web);
        const normalizedPageName = pageName.toLowerCase();
        
        // Validate page name is supported
        const supportedPages = NavigationConstants.getPageNames();
        if (!supportedPages.includes(normalizedPageName)) {
            throw new Error(`Unsupported page name: ${pageName}. Supported pages: ${supportedPages.join(', ')}`);
        }
        
        // Perform comprehensive page validation
        const validation = await navigationPage.verifyPageLoaded(normalizedPageName);
        
        if (!validation.isLoaded) {
            const errorDetails = validation.errors.join('; ');
            throw new Error(`Page validation failed for ${pageName}: ${errorDetails}`);
        }
        
        // Log validation results
        console.log(`Page validation successful for ${pageName}:`);
        console.log(`- URL: ${validation.url}`);
        console.log(`- Title: ${validation.title}`);
        console.log(`- Load time: ${validation.loadTime}ms`);
        console.log(`- Search interface present: ${validation.searchInterfacePresent}`);
        console.log(`- Responsive: ${validation.isResponsive}`);
        
    } catch (error) {
        console.error(`Failed to verify user is on ${pageName} page:`, error.message);
        throw new Error(`Page verification failed for ${pageName}: ${error.message}`);
    }
});

/**
 * Then step: Verify search interface responsiveness across viewports
 * Requirements: 3.4 - Support "And the search interface should be responsive" step
 */
Then('the search interface should be responsive', async function () {
    try {
        console.log('Verifying search interface responsiveness...');
        
        const navigationPage = new NavigationPage(this.web);
        
        // Get current viewport category for context
        const viewportCategory = await navigationPage.getCurrentViewportCategory();
        console.log(`Checking responsiveness for ${viewportCategory} viewport`);
        
        // Verify responsive interface
        const isResponsive = await navigationPage.verifyResponsiveInterface();
        
        if (!isResponsive) {
            throw new Error(`Search interface is not responsive for ${viewportCategory} viewport`);
        }
        
        console.log(`Successfully verified search interface responsiveness for ${viewportCategory} viewport`);
        
    } catch (error) {
        console.error('Failed to verify search interface responsiveness:', error.message);
        throw new Error(`Search interface responsiveness verification failed: ${error.message}`);
    }
});

// ===== ENHANCED NAVIGATION STEP DEFINITIONS =====

/**
 * When step: Navigate via mobile menu with touch-friendly interactions
 * Enhanced mobile navigation support
 */
When('the user navigates to {string} via mobile menu', async function (pageName: string) {
    try {
        console.log(`User navigating to ${pageName} via mobile menu...`);
        
        const navigationPage = new NavigationPage(this.web);
        const normalizedPageName = pageName.toLowerCase();
        
        // Ensure we're in mobile viewport
        const viewportCategory = await navigationPage.getCurrentViewportCategory();
        if (viewportCategory !== 'mobile') {
            console.warn(`Mobile menu navigation requested but viewport is ${viewportCategory}`);
        }
        
        // Validate page name
        const supportedPages = NavigationConstants.getPageNames();
        if (!supportedPages.includes(normalizedPageName)) {
            throw new Error(`Unsupported page name: ${pageName}. Supported pages: ${supportedPages.join(', ')}`);
        }
        
        // Navigate using mobile-specific logic
        await navigationPage.navigateToPage(normalizedPageName);
        
        console.log(`Successfully navigated to ${pageName} via mobile menu`);
        
    } catch (error) {
        console.error(`Failed to navigate to ${pageName} via mobile menu:`, error.message);
        throw new Error(`Mobile menu navigation failed for ${pageName}: ${error.message}`);
    }
});

/**
 * Then step: Verify page loads within specified timeout
 * Performance validation for navigation
 */
Then('the page should load within {int} seconds', async function (timeoutSeconds: number) {
    try {
        console.log(`Verifying page loads within ${timeoutSeconds} seconds...`);
        
        const startTime = Date.now();
        const navigationPage = new NavigationPage(this.web);
        
        // Wait for page to be fully loaded
        await navigationPage.waitForLoadingComplete();
        
        const loadTime = (Date.now() - startTime) / 1000;
        
        if (loadTime > timeoutSeconds) {
            throw new Error(`Page load took ${loadTime.toFixed(2)} seconds, expected within ${timeoutSeconds} seconds`);
        }
        
        console.log(`Page loaded successfully in ${loadTime.toFixed(2)} seconds (within ${timeoutSeconds} second limit)`);
        
    } catch (error) {
        console.error(`Page load timeout verification failed:`, error.message);
        throw new Error(`Page load performance verification failed: ${error.message}`);
    }
});

/**
 * Then step: Verify all navigation links are accessible
 * Comprehensive navigation accessibility check
 */
Then('all navigation links should be accessible', async function () {
    try {
        console.log('Verifying all navigation links are accessible...');
        
        const navigationPage = new NavigationPage(this.web);
        
        // Get available navigation links
        const availableLinks = await navigationPage.getNavigationLinks();
        const expectedPages = NavigationConstants.getPageNames();
        
        // Check if all expected pages are accessible
        const missingLinks = expectedPages.filter(page => !availableLinks.includes(page));
        
        if (missingLinks.length > 0) {
            throw new Error(`Missing navigation links: ${missingLinks.join(', ')}`);
        }
        
        // Verify navigation is responsive
        const isNavigationResponsive = await navigationPage.isNavigationResponsive();
        if (!isNavigationResponsive) {
            throw new Error('Navigation is not responsive for current viewport');
        }
        
        console.log(`Successfully verified all navigation links are accessible: ${availableLinks.join(', ')}`);
        
    } catch (error) {
        console.error('Failed to verify navigation link accessibility:', error.message);
        throw new Error(`Navigation accessibility verification failed: ${error.message}`);
    }
});

// ===== ERROR HANDLING AND RECOVERY STEP DEFINITIONS =====

/**
 * When step: Retry navigation with exponential backoff
 * Error recovery for failed navigation attempts
 */
When('the user retries navigating to {string}', async function (pageName: string) {
    try {
        console.log(`Retrying navigation to ${pageName}...`);
        
        const navigationPage = new NavigationPage(this.web);
        const normalizedPageName = pageName.toLowerCase();
        
        // Validate page name
        const supportedPages = NavigationConstants.getPageNames();
        if (!supportedPages.includes(normalizedPageName)) {
            throw new Error(`Unsupported page name: ${pageName}. Supported pages: ${supportedPages.join(', ')}`);
        }
        
        // Retry navigation with exponential backoff
        await navigationPage.retryNavigation(normalizedPageName, 3);
        
        console.log(`Successfully retried navigation to ${pageName}`);
        
    } catch (error) {
        console.error(`Failed to retry navigation to ${pageName}:`, error.message);
        throw new Error(`Navigation retry failed for ${pageName}: ${error.message}`);
    }
});

/**
 * When step: Use fallback navigation via direct URL
 * Fallback mechanism when UI navigation fails
 */
When('the user navigates to {string} via direct URL', async function (pageName: string) {
    try {
        console.log(`Using fallback navigation to ${pageName} via direct URL...`);
        
        const navigationPage = new NavigationPage(this.web);
        const normalizedPageName = pageName.toLowerCase();
        
        // Validate page name
        const supportedPages = NavigationConstants.getPageNames();
        if (!supportedPages.includes(normalizedPageName)) {
            throw new Error(`Unsupported page name: ${pageName}. Supported pages: ${supportedPages.join(', ')}`);
        }
        
        // Use fallback navigation
        await navigationPage.fallbackNavigation(normalizedPageName);
        
        console.log(`Successfully navigated to ${pageName} via direct URL fallback`);
        
    } catch (error) {
        console.error(`Failed fallback navigation to ${pageName}:`, error.message);
        throw new Error(`Fallback navigation failed for ${pageName}: ${error.message}`);
    }
});

// ===== VIEWPORT-SPECIFIC STEP DEFINITIONS =====

/**
 * Given step: Set specific viewport and navigate to base URL
 * Viewport-aware navigation setup
 */
Given('user is on baseurl with {string} viewport', async function (viewportType: string) {
    try {
        console.log(`Setting ${viewportType} viewport and navigating to base URL...`);
        
        const navigationPage = new NavigationPage(this.web);
        
        // Set appropriate viewport based on type
        switch (viewportType.toLowerCase()) {
            case 'mobile':
                await navigationPage.setMobileViewport();
                break;
            case 'tablet':
                await navigationPage.setTabletViewport();
                break;
            case 'desktop':
                await navigationPage.setDesktopViewport();
                break;
            default:
                console.warn(`Unknown viewport type: ${viewportType}, using mobile as default`);
                await navigationPage.setMobileViewport();
        }
        
        // Navigate to base URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        await this.web.getPage().goto(baseUrl);
        
        // Wait for page load with viewport-appropriate timeout
        const currentViewportCategory = await navigationPage.getCurrentViewportCategory();
        const timeout = NavigationConstants.getTimeout(currentViewportCategory, 'pageLoad');
        await this.web.getPage().waitForLoadState('networkidle', { timeout });
        
        await navigationPage.waitForLoadingComplete();
        
        console.log(`Successfully set ${viewportType} viewport and navigated to base URL`);
        
    } catch (error) {
        console.error(`Failed to set ${viewportType} viewport and navigate to base URL:`, error.message);
        throw new Error(`Viewport-specific navigation failed: ${error.message}`);
    }
});

/**
 * Then step: Verify responsive navigation for current viewport
 * Viewport-specific navigation validation
 */
Then('the navigation should be responsive for current viewport', async function () {
    try {
        console.log('Verifying navigation responsiveness for current viewport...');
        
        const navigationPage = new NavigationPage(this.web);
        const viewportCategory = await navigationPage.getCurrentViewportCategory();
        
        // Verify navigation is responsive for current viewport
        const isResponsive = await navigationPage.isNavigationResponsive();
        
        if (!isResponsive) {
            throw new Error(`Navigation is not responsive for ${viewportCategory} viewport`);
        }
        
        console.log(`Successfully verified navigation responsiveness for ${viewportCategory} viewport`);
        
    } catch (error) {
        console.error('Failed to verify navigation responsiveness:', error.message);
        throw new Error(`Navigation responsiveness verification failed: ${error.message}`);
    }
});