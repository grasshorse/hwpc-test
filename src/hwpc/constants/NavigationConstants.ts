/**
 * NavigationConstants - Configuration constants for HWPC navigation testing
 * Provides mobile-first navigation configuration and page definitions
 */

export interface ViewportConfig {
  width: number;
  height: number;
  category: 'mobile' | 'tablet' | 'desktop';
}

export interface TimeoutConfig {
  pageLoad: number;
  elementWait: number;
  networkIdle: number;
}

export interface PageConfig {
  name: string;
  url: string;
  title: string;
  selectors: {
    main: string;
    navigation: string;
    searchInterface?: string;
  };
}

/**
 * NavigationConstants class providing configuration for navigation testing
 */
class NavigationConstants {
  
  // Viewport configurations for responsive testing
  private static readonly VIEWPORTS: Record<string, ViewportConfig> = {
    mobile: { width: 375, height: 667, category: 'mobile' },
    tablet: { width: 768, height: 1024, category: 'tablet' },
    desktop: { width: 1920, height: 1080, category: 'desktop' }
  };

  // Timeout configurations by viewport category
  private static readonly TIMEOUTS: Record<string, TimeoutConfig> = {
    mobile: { pageLoad: 15000, elementWait: 10000, networkIdle: 5000 },
    tablet: { pageLoad: 12000, elementWait: 8000, networkIdle: 4000 },
    desktop: { pageLoad: 10000, elementWait: 6000, networkIdle: 3000 }
  };

  // Page configurations for navigation testing
  private static readonly PAGES: Record<string, PageConfig> = {
    home: {
      name: 'home',
      url: '/',
      title: 'HWPC - Home',
      selectors: {
        main: '[data-testid="home-page"]',
        navigation: '[data-testid="main-navigation"]',
        searchInterface: '[data-testid="search-interface"]'
      }
    },
    customers: {
      name: 'customers',
      url: '/customers',
      title: 'HWPC - Customers',
      selectors: {
        main: '[data-testid="customers-page"]',
        navigation: '[data-testid="main-navigation"]',
        searchInterface: '[data-testid="customer-search"]'
      }
    },
    tickets: {
      name: 'tickets',
      url: '/tickets',
      title: 'HWPC - Tickets',
      selectors: {
        main: '[data-testid="tickets-page"]',
        navigation: '[data-testid="main-navigation"]',
        searchInterface: '[data-testid="ticket-search"]'
      }
    },
    routes: {
      name: 'routes',
      url: '/routes',
      title: 'HWPC - Routes',
      selectors: {
        main: '[data-testid="routes-page"]',
        navigation: '[data-testid="main-navigation"]',
        searchInterface: '[data-testid="route-search"]'
      }
    },
    dashboard: {
      name: 'dashboard',
      url: '/dashboard',
      title: 'HWPC - Dashboard',
      selectors: {
        main: '[data-testid="dashboard-page"]',
        navigation: '[data-testid="main-navigation"]'
      }
    }
  };

  /**
   * Get timeout configuration for specific viewport category and operation
   */
  static getTimeout(viewportCategory: string, operation: keyof TimeoutConfig): number {
    const timeouts = this.TIMEOUTS[viewportCategory] || this.TIMEOUTS.mobile;
    return timeouts[operation];
  }

  /**
   * Get viewport configuration by name
   */
  static getViewport(viewportName: string): ViewportConfig {
    return this.VIEWPORTS[viewportName] || this.VIEWPORTS.mobile;
  }

  /**
   * Get all supported page names
   */
  static getPageNames(): string[] {
    return Object.keys(this.PAGES);
  }

  /**
   * Get page configuration by name
   */
  static getPageConfig(pageName: string): PageConfig | undefined {
    return this.PAGES[pageName.toLowerCase()];
  }

  /**
   * Get all viewport categories
   */
  static getViewportCategories(): string[] {
    return Object.keys(this.VIEWPORTS);
  }

  /**
   * Get base URL from environment or default
   */
  static getBaseUrl(): string {
    return process.env.BASE_URL || 'http://localhost:3000';
  }

  /**
   * Get full URL for a page
   */
  static getPageUrl(pageName: string): string {
    const pageConfig = this.getPageConfig(pageName);
    if (!pageConfig) {
      throw new Error(`Unknown page: ${pageName}`);
    }
    return this.getBaseUrl() + pageConfig.url;
  }

  /**
   * Get page title for validation
   */
  static getPageTitle(pageName: string): string {
    const pageConfig = this.getPageConfig(pageName);
    if (!pageConfig) {
      throw new Error(`Unknown page: ${pageName}`);
    }
    return pageConfig.title;
  }

  /**
   * Get page selectors for element identification
   */
  static getPageSelectors(pageName: string): PageConfig['selectors'] {
    const pageConfig = this.getPageConfig(pageName);
    if (!pageConfig) {
      throw new Error(`Unknown page: ${pageName}`);
    }
    return pageConfig.selectors;
  }

  /**
   * Check if page has search interface
   */
  static hasSearchInterface(pageName: string): boolean {
    const pageConfig = this.getPageConfig(pageName);
    return pageConfig?.selectors.searchInterface !== undefined;
  }

  /**
   * Get default mobile viewport
   */
  static getMobileViewport(): ViewportConfig {
    return this.VIEWPORTS.mobile;
  }

  /**
   * Get default tablet viewport
   */
  static getTabletViewport(): ViewportConfig {
    return this.VIEWPORTS.tablet;
  }

  /**
   * Get default desktop viewport
   */
  static getDesktopViewport(): ViewportConfig {
    return this.VIEWPORTS.desktop;
  }

  /**
   * Determine viewport category based on width
   */
  static getViewportCategoryByWidth(width: number): string {
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Get retry configuration for navigation
   */
  static getRetryConfig() {
    return {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      backoffFactor: 2
    };
  }

  /**
   * Get navigation selectors for different viewport categories
   */
  static getNavigationSelectors(viewportCategory: string) {
    const baseSelectors = {
      mainNav: '[data-testid="main-navigation"]',
      mobileMenuToggle: '[data-testid="mobile-menu-toggle"]',
      navLinks: '[data-testid="nav-link"]',
      searchInterface: '[data-testid="search-interface"]'
    };

    switch (viewportCategory) {
      case 'mobile':
        return {
          ...baseSelectors,
          activeNav: '[data-testid="mobile-navigation"]',
          menuButton: '[data-testid="mobile-menu-button"]'
        };
      case 'tablet':
        return {
          ...baseSelectors,
          activeNav: '[data-testid="tablet-navigation"]'
        };
      case 'desktop':
        return {
          ...baseSelectors,
          activeNav: '[data-testid="desktop-navigation"]'
        };
      default:
        return baseSelectors;
    }
  }

  // Legacy method compatibility for NavigationPage.ts
  static getNavigationSelector(pageName: string, isMobile: boolean): string {
    const viewportCategory = isMobile ? 'mobile' : 'desktop';
    const selectors = this.getNavigationSelectors(viewportCategory);
    return selectors.mainNav;
  }

  // URL matching methods
  static matchesPageUrl(currentUrl: string, pageName: string): boolean {
    const pageConfig = this.getPageConfig(pageName);
    if (!pageConfig) return false;
    return currentUrl.includes(pageConfig.url);
  }

  static matchesPageTitle(currentTitle: string, pageName: string): boolean {
    const pageConfig = this.getPageConfig(pageName);
    if (!pageConfig) return false;
    return currentTitle.includes(pageConfig.title);
  }

  // Page identifier methods
  static getPageIdentifierSelector(pageName: string, isMobile: boolean): string {
    const pageConfig = this.getPageConfig(pageName);
    if (!pageConfig) return '[data-testid="page-identifier"]';
    return pageConfig.selectors.main;
  }

  static getRequiredElements(pageName: string): string[] {
    const pageConfig = this.getPageConfig(pageName);
    if (!pageConfig) return [];
    return [pageConfig.selectors.main, pageConfig.selectors.navigation];
  }

  static getSearchInterfaceSelector(pageName: string, isMobile: boolean): string {
    const pageConfig = this.getPageConfig(pageName);
    if (!pageConfig || !pageConfig.selectors.searchInterface) {
      return '[data-testid="search-interface"]';
    }
    return pageConfig.selectors.searchInterface;
  }

  // Static selector constants for compatibility
  static readonly MOBILE_MENU_CONTAINER = '[data-testid="mobile-menu-container"]';
  static readonly MOBILE_MENU_TOGGLE = '[data-testid="mobile-menu-toggle"]';
  static readonly MOBILE_CONTAINER = '[data-testid="mobile-container"]';
  static readonly MOBILE_HIDDEN = '[data-mobile-hidden="true"]';
  static readonly TABLET_CONTAINER = '[data-testid="tablet-container"]';
  static readonly TABLET_VISIBLE = '[data-tablet-visible="true"]';
  static readonly DESKTOP_CONTAINER = '[data-testid="desktop-container"]';
  static readonly DESKTOP_VISIBLE = '[data-desktop-visible="true"]';
  static readonly MAIN_NAVIGATION = '[data-testid="main-navigation"]';
  static readonly NAVIGATION_MENU = '[data-testid="navigation-menu"]';
  static readonly MOBILE_SEARCH_CONTAINER = '[data-testid="mobile-search-container"]';
  static readonly SEARCH_CONTAINER = '[data-testid="search-container"]';
  static readonly MOBILE_SEARCH_INPUT = '[data-testid="mobile-search-input"]';
  static readonly SEARCH_INPUT = '[data-testid="search-input"]';
  static readonly RESPONSIVE_CONTAINER = '[data-testid="responsive-container"]';

  // Mobile menu configuration
  static readonly MOBILE_MENU_CONFIG = {
    slideInDuration: 300,
    slideOutDuration: 250
  };

  // Touch target validation
  static isTouchTargetAdequate(width: number, height: number): boolean {
    const minTouchTarget = 44; // iOS/Android minimum touch target size
    return width >= minTouchTarget && height >= minTouchTarget;
  }
}

// Export PageValidation interface for NavigationPage compatibility
export interface PageValidation {
  isLoaded: boolean;
  url: string;
  title: string;
  loadTime: number;
  searchInterfacePresent: boolean;
  isResponsive: boolean;
  errors: string[];
}

export default NavigationConstants;