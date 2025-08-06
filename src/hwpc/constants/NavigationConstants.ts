/**
 * HWPC Navigation Constants - Comprehensive navigation testing configuration
 * Provides page definitions, selectors, and mobile-specific configurations for navigation testing
 */

// ===== INTERFACE DEFINITIONS =====

export interface PageConfiguration {
    url: string;
    title: string;
    selectors: {
        navigationLink: string;
        pageIdentifier: string;
        searchInterface: string;
    };
    mobileSelectors: {
        mobileNavigationLink: string;
        mobilePageIdentifier: string;
        mobileSearchInterface: string;
    };
    loadTimeout: number;
    requiredElements: string[];
}

export interface NavigationConfig {
    pages: {
        [key: string]: PageConfiguration;
    };
    responsive: {
        breakpoints: {
            mobile: number;
            tablet: number;
            desktop: number;
        };
        touchTargetMinSize: number;
    };
}

export interface PageValidation {
    url: string;
    title: string;
    isLoaded: boolean;
    isResponsive: boolean;
    searchInterfacePresent: boolean;
    loadTime: number;
    errors: string[];
}

export interface TouchGestureConstants {
    tapDuration: number;
    longPressDuration: number;
    swipeDistance: number;
    swipeVelocity: number;
    touchTargetMinSize: number;
}

// ===== NAVIGATION CONSTANTS CLASS =====

export default class NavigationConstants {
    
    // ===== PAGE DEFINITIONS =====
    
    static readonly PAGES: NavigationConfig = {
        pages: {
            tickets: {
                url: "/tickets",
                title: "Tickets",
                selectors: {
                    navigationLink: "[data-testid='nav-tickets'], .nav-tickets, a[href*='tickets'], .navbar-nav a:has-text('Tickets')",
                    pageIdentifier: "[data-testid='tickets-page'], .tickets-page, .page-tickets, h1:has-text('Tickets'), .page-title:has-text('Tickets')",
                    searchInterface: "[data-testid='ticket-search'], .ticket-search, .search-tickets, input[placeholder*='search' i][name*='ticket' i], .ticket-search-input"
                },
                mobileSelectors: {
                    mobileNavigationLink: "[data-testid='mobile-nav-tickets'], .mobile-nav-tickets, .mobile-menu a[href*='tickets'], .navbar-collapse a:has-text('Tickets')",
                    mobilePageIdentifier: "[data-testid='mobile-tickets-page'], .mobile-tickets-page, .tickets-mobile, .page-header h1:has-text('Tickets')",
                    mobileSearchInterface: "[data-testid='mobile-ticket-search'], .mobile-ticket-search, .search-mobile input[name*='ticket' i], .mobile-search-tickets"
                },
                loadTimeout: 8000,
                requiredElements: [
                    ".tickets-container, .ticket-list, [data-testid='tickets-container']",
                    ".search-interface, .ticket-search, [data-testid='search-interface']"
                ]
            },
            customers: {
                url: "/customers",
                title: "Customers",
                selectors: {
                    navigationLink: "[data-testid='nav-customers'], .nav-customers, a[href*='customers'], .navbar-nav a:has-text('Customers')",
                    pageIdentifier: "[data-testid='customers-page'], .customers-page, .page-customers, h1:has-text('Customers'), .page-title:has-text('Customers')",
                    searchInterface: "[data-testid='customer-search'], .customer-search, .search-customers, input[placeholder*='search' i][name*='customer' i], .customer-search-input"
                },
                mobileSelectors: {
                    mobileNavigationLink: "[data-testid='mobile-nav-customers'], .mobile-nav-customers, .mobile-menu a[href*='customers'], .navbar-collapse a:has-text('Customers')",
                    mobilePageIdentifier: "[data-testid='mobile-customers-page'], .mobile-customers-page, .customers-mobile, .page-header h1:has-text('Customers')",
                    mobileSearchInterface: "[data-testid='mobile-customer-search'], .mobile-customer-search, .search-mobile input[name*='customer' i], .mobile-search-customers"
                },
                loadTimeout: 8000,
                requiredElements: [
                    ".customers-container, .customer-list, [data-testid='customers-container']",
                    ".search-interface, .customer-search, [data-testid='search-interface']"
                ]
            },
            routes: {
                url: "/routes",
                title: "Routes",
                selectors: {
                    navigationLink: "[data-testid='nav-routes'], .nav-routes, a[href*='routes'], .navbar-nav a:has-text('Routes')",
                    pageIdentifier: "[data-testid='routes-page'], .routes-page, .page-routes, h1:has-text('Routes'), .page-title:has-text('Routes')",
                    searchInterface: "[data-testid='route-search'], .route-search, .search-routes, input[placeholder*='search' i][name*='route' i], .route-search-input"
                },
                mobileSelectors: {
                    mobileNavigationLink: "[data-testid='mobile-nav-routes'], .mobile-nav-routes, .mobile-menu a[href*='routes'], .navbar-collapse a:has-text('Routes')",
                    mobilePageIdentifier: "[data-testid='mobile-routes-page'], .mobile-routes-page, .routes-mobile, .page-header h1:has-text('Routes')",
                    mobileSearchInterface: "[data-testid='mobile-route-search'], .mobile-route-search, .search-mobile input[name*='route' i], .mobile-search-routes"
                },
                loadTimeout: 10000, // Routes may have maps, so longer timeout
                requiredElements: [
                    ".routes-container, .route-list, [data-testid='routes-container']",
                    ".search-interface, .route-search, [data-testid='search-interface']"
                ]
            },
            reports: {
                url: "/reports",
                title: "Reports",
                selectors: {
                    navigationLink: "[data-testid='nav-reports'], .nav-reports, a[href*='reports'], .navbar-nav a:has-text('Reports')",
                    pageIdentifier: "[data-testid='reports-page'], .reports-page, .page-reports, h1:has-text('Reports'), .page-title:has-text('Reports')",
                    searchInterface: "[data-testid='report-search'], .report-search, .search-reports, input[placeholder*='search' i][name*='report' i], .report-search-input"
                },
                mobileSelectors: {
                    mobileNavigationLink: "[data-testid='mobile-nav-reports'], .mobile-nav-reports, .mobile-menu a[href*='reports'], .navbar-collapse a:has-text('Reports')",
                    mobilePageIdentifier: "[data-testid='mobile-reports-page'], .mobile-reports-page, .reports-mobile, .page-header h1:has-text('Reports')",
                    mobileSearchInterface: "[data-testid='mobile-report-search'], .mobile-report-search, .search-mobile input[name*='report' i], .mobile-search-reports"
                },
                loadTimeout: 10000, // Reports may have charts, so longer timeout
                requiredElements: [
                    ".reports-container, .report-list, [data-testid='reports-container']",
                    ".search-interface, .report-search, [data-testid='search-interface']"
                ]
            },
            dashboard: {
                url: "/dashboard",
                title: "Dashboard",
                selectors: {
                    navigationLink: "[data-testid='nav-dashboard'], .nav-dashboard, a[href*='dashboard'], .navbar-nav a:has-text('Dashboard')",
                    pageIdentifier: "[data-testid='dashboard-page'], .dashboard-page, .page-dashboard, h1:has-text('Dashboard'), .page-title:has-text('Dashboard')",
                    searchInterface: "[data-testid='dashboard-search'], .dashboard-search, .search-dashboard, input[placeholder*='search' i][name*='dashboard' i], .dashboard-search-input"
                },
                mobileSelectors: {
                    mobileNavigationLink: "[data-testid='mobile-nav-dashboard'], .mobile-nav-dashboard, .mobile-menu a[href*='dashboard'], .navbar-collapse a:has-text('Dashboard')",
                    mobilePageIdentifier: "[data-testid='mobile-dashboard-page'], .mobile-dashboard-page, .dashboard-mobile, .page-header h1:has-text('Dashboard')",
                    mobileSearchInterface: "[data-testid='mobile-dashboard-search'], .mobile-dashboard-search, .search-mobile input[name*='dashboard' i], .mobile-search-dashboard"
                },
                loadTimeout: 10000, // Dashboard may have widgets and charts, so longer timeout
                requiredElements: [
                    ".dashboard-container, .dashboard-widgets, [data-testid='dashboard-container']",
                    ".search-interface, .dashboard-search, [data-testid='search-interface']"
                ]
            }
        },
        responsive: {
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1200
            },
            touchTargetMinSize: 44 // pixels - minimum touch target size for mobile accessibility
        }
    };
    
    // ===== NAVIGATION SELECTORS =====
    
    // Main navigation selectors
    static readonly MAIN_NAVIGATION = "[data-testid='main-nav'], .main-nav, .navbar, .navigation, .primary-nav";
    static readonly NAVIGATION_MENU = "[data-testid='nav-menu'], .nav-menu, .navbar-nav, .navigation-menu, .main-menu";
    static readonly NAVIGATION_BRAND = "[data-testid='nav-brand'], .navbar-brand, .brand, .logo";
    
    // Mobile navigation selectors
    static readonly MOBILE_MENU_TOGGLE = "[data-testid='mobile-menu-toggle'], .mobile-menu-toggle, .navbar-toggler, .hamburger-menu, .mobile-nav-toggle";
    static readonly MOBILE_MENU_CONTAINER = "[data-testid='mobile-menu'], .mobile-menu, .navbar-collapse, .mobile-nav-menu, .nav-mobile";
    static readonly MOBILE_MENU_OVERLAY = "[data-testid='mobile-overlay'], .mobile-menu-overlay, .navbar-backdrop, .menu-overlay, .mobile-backdrop";
    static readonly MOBILE_MENU_CLOSE = "[data-testid='mobile-close'], .mobile-menu-close, .close-mobile-menu, .menu-close";
    
    // Navigation states
    static readonly ACTIVE_NAV_ITEM = ".active, .current, .selected, [aria-current='page']";
    static readonly DISABLED_NAV_ITEM = ".disabled, [aria-disabled='true'], [disabled]";
    
    // ===== SEARCH INTERFACE SELECTORS =====
    
    // General search selectors
    static readonly SEARCH_CONTAINER = "[data-testid='search-container'], .search-container, .search-wrapper, .search-section";
    static readonly SEARCH_INPUT = "[data-testid='search-input'], .search-input, input[type='search'], input[name*='search' i], input[placeholder*='search' i]";
    static readonly SEARCH_BUTTON = "[data-testid='search-button'], .search-button, .search-btn, button[type='submit'], .btn-search";
    static readonly SEARCH_CLEAR = "[data-testid='search-clear'], .search-clear, .clear-search, .search-reset";
    static readonly SEARCH_RESULTS = "[data-testid='search-results'], .search-results, .results-container, .search-output";
    
    // Mobile search selectors
    static readonly MOBILE_SEARCH_CONTAINER = "[data-testid='mobile-search'], .mobile-search, .search-mobile, .mobile-search-container";
    static readonly MOBILE_SEARCH_INPUT = "[data-testid='mobile-search-input'], .mobile-search-input, .search-input-mobile";
    static readonly MOBILE_SEARCH_BUTTON = "[data-testid='mobile-search-btn'], .mobile-search-btn, .search-btn-mobile";
    static readonly MOBILE_SEARCH_TOGGLE = "[data-testid='mobile-search-toggle'], .mobile-search-toggle, .search-toggle-mobile";
    
    // Search states
    static readonly SEARCH_LOADING = "[data-testid='search-loading'], .search-loading, .search-spinner, .loading-search";
    static readonly SEARCH_NO_RESULTS = "[data-testid='no-results'], .no-results, .search-empty, .no-search-results";
    
    // ===== RESPONSIVE DESIGN SELECTORS =====
    
    // Responsive containers
    static readonly RESPONSIVE_CONTAINER = ".container, .container-fluid, .responsive-container, [data-responsive]";
    static readonly MOBILE_CONTAINER = ".container-mobile, .mobile-container, [data-mobile-container]";
    static readonly TABLET_CONTAINER = ".container-tablet, .tablet-container, [data-tablet-container]";
    static readonly DESKTOP_CONTAINER = ".container-desktop, .desktop-container, [data-desktop-container]";
    
    // Responsive visibility classes
    static readonly MOBILE_VISIBLE = ".d-block.d-md-none, .mobile-only, .show-mobile, [data-mobile-only]";
    static readonly MOBILE_HIDDEN = ".d-none.d-md-block, .mobile-hidden, .hide-mobile, [data-mobile-hidden]";
    static readonly TABLET_VISIBLE = ".d-none.d-md-block.d-lg-none, .tablet-only, .show-tablet, [data-tablet-only]";
    static readonly DESKTOP_VISIBLE = ".d-none.d-lg-block, .desktop-only, .show-desktop, [data-desktop-only]";
    
    // ===== TOUCH-FRIENDLY INTERACTION CONSTANTS =====
    
    static readonly TOUCH_GESTURES: TouchGestureConstants = {
        tapDuration: 100,        // milliseconds
        longPressDuration: 1000, // milliseconds
        swipeDistance: 100,      // pixels
        swipeVelocity: 500,      // pixels per second
        touchTargetMinSize: 44   // pixels - minimum touch target size
    };
    
    // Touch interaction delays
    static readonly TOUCH_DELAYS = {
        clickDelay: 100,         // milliseconds
        typeDelay: 50,           // milliseconds
        scrollDelay: 200,        // milliseconds
        transitionDelay: 500,    // milliseconds
        keyboardShowDelay: 500,  // milliseconds
        keyboardHideDelay: 300   // milliseconds
    };
    
    // ===== MOBILE MENU CONFIGURATION =====
    
    static readonly MOBILE_MENU_CONFIG = {
        slideInDuration: 300,    // milliseconds
        slideOutDuration: 300,   // milliseconds
        fadeInDuration: 200,     // milliseconds
        fadeOutDuration: 200,    // milliseconds
        overlayOpacity: 0.5,     // overlay background opacity
        swipeThreshold: 50       // pixels - minimum swipe distance to trigger action
    };
    
    // ===== PAGE LOAD TIMEOUTS =====
    
    static readonly TIMEOUTS = {
        mobile: {
            pageLoad: 8000,      // milliseconds
            elementWait: 5000,   // milliseconds
            networkIdle: 10000,  // milliseconds
            searchResults: 6000  // milliseconds
        },
        tablet: {
            pageLoad: 6000,      // milliseconds
            elementWait: 4000,   // milliseconds
            networkIdle: 8000,   // milliseconds
            searchResults: 5000  // milliseconds
        },
        desktop: {
            pageLoad: 5000,      // milliseconds
            elementWait: 3000,   // milliseconds
            networkIdle: 6000,   // milliseconds
            searchResults: 4000  // milliseconds
        }
    };
    
    // ===== URL PATTERNS =====
    
    static readonly URL_PATTERNS = {
        tickets: /\/tickets\/?(\?.*)?$/,
        customers: /\/customers\/?(\?.*)?$/,
        routes: /\/routes\/?(\?.*)?$/,
        reports: /\/reports\/?(\?.*)?$/,
        dashboard: /\/dashboard\/?(\?.*)?$/,
        home: /^\/?(\?.*)?$/
    };
    
    // ===== PAGE TITLES =====
    
    static readonly PAGE_TITLES = {
        tickets: ["Tickets", "Ticket Management", "HWPC - Tickets"],
        customers: ["Customers", "Customer Management", "HWPC - Customers"],
        routes: ["Routes", "Route Management", "HWPC - Routes"],
        reports: ["Reports", "Report Management", "HWPC - Reports"],
        dashboard: ["Dashboard", "HWPC Dashboard", "HWPC - Dashboard"],
        home: ["Home", "HWPC", "HWPC - Home"]
    };
    
    // ===== ACCESSIBILITY CONSTANTS =====
    
    static readonly ACCESSIBILITY = {
        ariaLabels: {
            mainNavigation: "Main navigation",
            mobileMenuToggle: "Toggle mobile menu",
            searchInput: "Search input",
            searchButton: "Search button",
            closeButton: "Close"
        },
        roles: {
            navigation: "navigation",
            search: "search",
            button: "button",
            textbox: "textbox"
        },
        states: {
            expanded: "aria-expanded",
            hidden: "aria-hidden",
            current: "aria-current",
            disabled: "aria-disabled"
        }
    };
    
    // ===== UTILITY METHODS =====
    
    /**
     * Get page configuration by name
     * @param pageName - Name of the page (tickets, customers, routes, reports, dashboard)
     * @returns Page configuration object
     */
    static getPageConfig(pageName: string): PageConfiguration | null {
        const normalizedName = pageName.toLowerCase();
        return this.PAGES.pages[normalizedName] || null;
    }
    
    /**
     * Get all available page names
     * @returns Array of page names
     */
    static getPageNames(): string[] {
        return Object.keys(this.PAGES.pages);
    }
    
    /**
     * Get navigation selector for a page based on viewport
     * @param pageName - Name of the page
     * @param isMobile - Whether the current viewport is mobile
     * @returns Navigation selector string
     */
    static getNavigationSelector(pageName: string, isMobile: boolean = false): string {
        const pageConfig = this.getPageConfig(pageName);
        if (!pageConfig) {
            throw new Error(`Page configuration not found for: ${pageName}`);
        }
        
        return isMobile 
            ? pageConfig.mobileSelectors.mobileNavigationLink
            : pageConfig.selectors.navigationLink;
    }
    
    /**
     * Get page identifier selector for a page based on viewport
     * @param pageName - Name of the page
     * @param isMobile - Whether the current viewport is mobile
     * @returns Page identifier selector string
     */
    static getPageIdentifierSelector(pageName: string, isMobile: boolean = false): string {
        const pageConfig = this.getPageConfig(pageName);
        if (!pageConfig) {
            throw new Error(`Page configuration not found for: ${pageName}`);
        }
        
        return isMobile 
            ? pageConfig.mobileSelectors.mobilePageIdentifier
            : pageConfig.selectors.pageIdentifier;
    }
    
    /**
     * Get search interface selector for a page based on viewport
     * @param pageName - Name of the page
     * @param isMobile - Whether the current viewport is mobile
     * @returns Search interface selector string
     */
    static getSearchInterfaceSelector(pageName: string, isMobile: boolean = false): string {
        const pageConfig = this.getPageConfig(pageName);
        if (!pageConfig) {
            throw new Error(`Page configuration not found for: ${pageName}`);
        }
        
        return isMobile 
            ? pageConfig.mobileSelectors.mobileSearchInterface
            : pageConfig.selectors.searchInterface;
    }
    
    /**
     * Get timeout value based on viewport category
     * @param viewportCategory - mobile, tablet, or desktop
     * @param timeoutType - pageLoad, elementWait, networkIdle, or searchResults
     * @returns Timeout value in milliseconds
     */
    static getTimeout(viewportCategory: 'mobile' | 'tablet' | 'desktop', timeoutType: keyof typeof NavigationConstants.TIMEOUTS.mobile): number {
        return this.TIMEOUTS[viewportCategory][timeoutType];
    }
    
    /**
     * Check if URL matches a page pattern
     * @param url - URL to check
     * @param pageName - Name of the page to match against
     * @returns Boolean indicating if URL matches the page pattern
     */
    static matchesPageUrl(url: string, pageName: string): boolean {
        const pattern = this.URL_PATTERNS[pageName as keyof typeof this.URL_PATTERNS];
        return pattern ? pattern.test(url) : false;
    }
    
    /**
     * Check if title matches expected page titles
     * @param title - Page title to check
     * @param pageName - Name of the page to match against
     * @returns Boolean indicating if title matches expected titles
     */
    static matchesPageTitle(title: string, pageName: string): boolean {
        const expectedTitles = this.PAGE_TITLES[pageName as keyof typeof this.PAGE_TITLES];
        return expectedTitles ? expectedTitles.some(expectedTitle => 
            title.toLowerCase().includes(expectedTitle.toLowerCase())
        ) : false;
    }
    
    /**
     * Get responsive breakpoint for viewport width
     * @param width - Viewport width in pixels
     * @returns Viewport category (mobile, tablet, desktop)
     */
    static getViewportCategory(width: number): 'mobile' | 'tablet' | 'desktop' {
        if (width < this.PAGES.responsive.breakpoints.mobile) {
            return 'mobile';
        } else if (width < this.PAGES.responsive.breakpoints.tablet) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }
    
    /**
     * Check if touch target meets minimum size requirements
     * @param width - Element width in pixels
     * @param height - Element height in pixels
     * @returns Boolean indicating if touch target is adequately sized
     */
    static isTouchTargetAdequate(width: number, height: number): boolean {
        const minSize = this.PAGES.responsive.touchTargetMinSize;
        return width >= minSize && height >= minSize;
    }
    
    /**
     * Get all required elements for a page
     * @param pageName - Name of the page
     * @returns Array of required element selectors
     */
    static getRequiredElements(pageName: string): string[] {
        const pageConfig = this.getPageConfig(pageName);
        return pageConfig ? pageConfig.requiredElements : [];
    }
    
    /**
     * Get page load timeout for a specific page
     * @param pageName - Name of the page
     * @returns Timeout value in milliseconds
     */
    static getPageLoadTimeout(pageName: string): number {
        const pageConfig = this.getPageConfig(pageName);
        return pageConfig ? pageConfig.loadTimeout : this.TIMEOUTS.desktop.pageLoad;
    }
}