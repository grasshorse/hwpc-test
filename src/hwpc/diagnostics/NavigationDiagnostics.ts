import { Page } from '@playwright/test';
import NavigationConstants from '../constants/NavigationConstants';

/**
 * Interfaces for navigation diagnostics
 */
export interface ElementDiagnostic {
  selector: string;
  elementName: string;
  isPresent: boolean;
  isVisible: boolean;
  isClickable: boolean;
  boundingBox: BoundingBox | null;
  attributes: Record<string, string>;
  computedStyles: Record<string, string>;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NetworkActivityLog {
  timestamp: number;
  url: string;
  method: string;
  status: number;
  responseTime: number;
  resourceType: string;
}

export interface ApplicationState {
  isAuthenticated: boolean;
  currentUser: string | null;
  loadingIndicators: boolean;
  errorMessages: string[];
  consoleErrors: string[];
}

export interface NavigationDiagnostics {
  currentUrl: string;
  expectedUrl: string;
  navigationElementsFound: ElementDiagnostic[];
  networkActivity: NetworkActivityLog[];
  javascriptErrors: JavaScriptError[];
  applicationState: ApplicationState;
  routingType: 'server-side' | 'client-side' | 'hybrid' | 'unknown';
}

export interface JavaScriptError {
  message: string;
  source: string;
  line: number;
  column: number;
  timestamp: number;
}

export interface DiagnosticReport {
  timestamp: string;
  pageName: string;
  viewport: string;
  diagnostics: NavigationDiagnostics;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * NavigationDiagnostics - Comprehensive navigation state analysis and issue identification
 * 
 * This class provides detailed diagnostics for navigation failures, including:
 * - Element detection with multiple selector strategies
 * - Network activity monitoring
 * - Application state detection
 * - JavaScript error tracking
 * - Routing type identification
 */
export class NavigationDiagnosticsSystem {
  private page: Page;
  private networkLogs: NetworkActivityLog[] = [];
  private jsErrors: JavaScriptError[] = [];
  private isMonitoring: boolean = false;

  constructor(page: Page) {
    this.page = page;
    this.setupNetworkMonitoring();
    this.setupErrorMonitoring();
  }

  /**
   * Setup network activity monitoring
   */
  private setupNetworkMonitoring(): void {
    this.page.on('request', (request) => {
      if (!this.isMonitoring) return;
      
      const startTime = Date.now();
      request.response().then((response) => {
        if (response) {
          this.networkLogs.push({
            timestamp: startTime,
            url: request.url(),
            method: request.method(),
            status: response.status(),
            responseTime: Date.now() - startTime,
            resourceType: request.resourceType()
          });
        }
      }).catch(() => {
        // Request failed or was aborted
        this.networkLogs.push({
          timestamp: startTime,
          url: request.url(),
          method: request.method(),
          status: 0,
          responseTime: Date.now() - startTime,
          resourceType: request.resourceType()
        });
      });
    });
  }

  /**
   * Setup JavaScript error monitoring
   */
  private setupErrorMonitoring(): void {
    this.page.on('pageerror', (error) => {
      if (!this.isMonitoring) return;
      
      this.jsErrors.push({
        message: error.message,
        source: error.stack || 'unknown',
        line: 0,
        column: 0,
        timestamp: Date.now()
      });
    });

    this.page.on('console', (msg) => {
      if (!this.isMonitoring) return;
      
      if (msg.type() === 'error') {
        this.jsErrors.push({
          message: msg.text(),
          source: 'console',
          line: 0,
          column: 0,
          timestamp: Date.now()
        });
      }
    });
  }

  /**
   * Start monitoring network and error activity
   */
  public startMonitoring(): void {
    this.isMonitoring = true;
    this.networkLogs = [];
    this.jsErrors = [];
  }

  /**
   * Stop monitoring network and error activity
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
  }

  /**
   * Analyze current navigation state and identify issues
   */
  public async analyzeNavigationState(pageName: string, expectedUrl?: string): Promise<NavigationDiagnostics> {
    console.log(`Starting navigation diagnostics for ${pageName}...`);

    const currentUrl = this.page.url();
    const calculatedExpectedUrl = expectedUrl || NavigationConstants.getPageUrl(pageName);

    // Analyze navigation elements
    const navigationElements = await this.analyzeNavigationElements(pageName);

    // Detect application state
    const applicationState = await this.detectApplicationState();

    // Determine routing type
    const routingType = await this.detectRoutingType();

    const diagnostics: NavigationDiagnostics = {
      currentUrl,
      expectedUrl: calculatedExpectedUrl,
      navigationElementsFound: navigationElements,
      networkActivity: [...this.networkLogs],
      javascriptErrors: [...this.jsErrors],
      applicationState,
      routingType
    };

    console.log(`Navigation diagnostics completed for ${pageName}`);
    return diagnostics;
  }

  /**
   * Analyze navigation elements with multiple selector strategies
   */
  private async analyzeNavigationElements(pageName: string): Promise<ElementDiagnostic[]> {
    const elements: ElementDiagnostic[] = [];
    
    // Get navigation selectors for the page
    const navigationSelectors = this.getNavigationSelectors(pageName);
    
    for (const [elementName, selector] of Object.entries(navigationSelectors)) {
      try {
        const diagnostic = await this.analyzeElement(selector, elementName);
        elements.push(diagnostic);
      } catch (error) {
        elements.push({
          selector,
          elementName,
          isPresent: false,
          isVisible: false,
          isClickable: false,
          boundingBox: null,
          attributes: {},
          computedStyles: {},
        });
      }
    }

    return elements;
  }

  /**
   * Get comprehensive navigation selectors for a page
   */
  private getNavigationSelectors(pageName: string): Record<string, string> {
    const pageConfig = NavigationConstants.getPageConfig(pageName);
    const baseSelectors = {
      'main-navigation': NavigationConstants.MAIN_NAVIGATION,
      'mobile-menu-toggle': NavigationConstants.MOBILE_MENU_TOGGLE,
      'mobile-menu-container': NavigationConstants.MOBILE_MENU_CONTAINER,
      'navigation-menu': NavigationConstants.NAVIGATION_MENU,
    };

    // Add page-specific navigation link selectors
    const pageNavigationSelectors = [
      `a[href*="${pageName}"]`,
      `a[href*="/${pageName}"]`,
      `[data-nav="${pageName}"]`,
      `[data-testid="${pageName}-link"]`,
      `[data-testid="nav-${pageName}"]`,
      `.nav-${pageName}`,
      `.${pageName}-link`,
      `button[onclick*="${pageName}"]`,
      `[role="button"][data-page="${pageName}"]`,
      `.menu-item[href*="${pageName}"]`,
      `.nav-item a[href*="${pageName}"]`
    ];

    baseSelectors[`${pageName}-navigation-link`] = pageNavigationSelectors.join(', ');

    // Add page identifier selectors
    if (pageConfig) {
      baseSelectors['page-identifier'] = pageConfig.selectors.main;
      if (pageConfig.selectors.searchInterface) {
        baseSelectors['search-interface'] = pageConfig.selectors.searchInterface;
      }
    }

    return baseSelectors;
  }

  /**
   * Analyze a specific element with comprehensive diagnostics
   */
  private async analyzeElement(selector: string, elementName: string): Promise<ElementDiagnostic> {
    const locator = this.page.locator(selector).first();
    
    // Check if element is present
    const isPresent = await locator.count() > 0;
    
    if (!isPresent) {
      return {
        selector,
        elementName,
        isPresent: false,
        isVisible: false,
        isClickable: false,
        boundingBox: null,
        attributes: {},
        computedStyles: {}
      };
    }

    // Check visibility
    const isVisible = await locator.isVisible().catch(() => false);
    
    // Check if clickable
    const isClickable = await locator.isEnabled().catch(() => false) && isVisible;
    
    // Get bounding box
    const boundingBox = await locator.boundingBox().catch(() => null);
    
    // Get attributes
    const attributes: Record<string, string> = {};
    try {
      const element = await locator.elementHandle();
      if (element) {
        const attributeNames = await element.evaluate((el) => {
          const attrs: Record<string, string> = {};
          for (let i = 0; i < el.attributes.length; i++) {
            const attr = el.attributes[i];
            attrs[attr.name] = attr.value;
          }
          return attrs;
        });
        Object.assign(attributes, attributeNames);
      }
    } catch (error) {
      // Attributes not available
    }

    // Get computed styles for key properties
    const computedStyles: Record<string, string> = {};
    try {
      const styles = await locator.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          position: computed.position,
          zIndex: computed.zIndex,
          pointerEvents: computed.pointerEvents
        };
      });
      Object.assign(computedStyles, styles);
    } catch (error) {
      // Styles not available
    }

    return {
      selector,
      elementName,
      isPresent,
      isVisible,
      isClickable,
      boundingBox,
      attributes,
      computedStyles
    };
  }

  /**
   * Detect current application state
   */
  private async detectApplicationState(): Promise<ApplicationState> {
    try {
      const state = await this.page.evaluate(() => {
        // Check for authentication indicators
        const isAuthenticated = !!(
          localStorage.getItem('auth_user') ||
          localStorage.getItem('session_token') ||
          document.cookie.includes('mvp_session') ||
          document.cookie.includes('auth_token')
        );

        // Get current user info
        const currentUser = localStorage.getItem('user_id') || 
                           localStorage.getItem('username') || 
                           null;

        // Check for loading indicators
        const loadingIndicators = !!(
          document.querySelector('.loading') ||
          document.querySelector('.spinner') ||
          document.querySelector('[data-loading="true"]') ||
          document.querySelector('.loader')
        );

        // Check for error messages
        const errorElements = document.querySelectorAll('.error, .alert-danger, [data-error], .error-message');
        const errorMessages = Array.from(errorElements).map(el => el.textContent || '').filter(text => text.trim());

        return {
          isAuthenticated,
          currentUser,
          loadingIndicators,
          errorMessages
        };
      });

      return {
        ...state,
        consoleErrors: this.jsErrors.map(error => error.message)
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        currentUser: null,
        loadingIndicators: false,
        errorMessages: [`Failed to detect application state: ${error.message}`],
        consoleErrors: this.jsErrors.map(error => error.message)
      };
    }
  }

  /**
   * Detect the type of routing used by the application
   */
  private async detectRoutingType(): Promise<'server-side' | 'client-side' | 'hybrid' | 'unknown'> {
    try {
      const routingInfo = await this.page.evaluate(() => {
        // Check for common client-side routing indicators
        const hasReactRouter = !!(window as any).React || !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
        const hasVueRouter = !!(window as any).Vue;
        const hasAngularRouter = !!(window as any).ng;
        const hasHistoryAPI = !!(window.history && window.history.pushState);
        
        // Check for SPA indicators
        const hasSPAIndicators = !!(
          document.querySelector('[data-reactroot]') ||
          document.querySelector('[data-vue-app]') ||
          document.querySelector('[ng-app]') ||
          document.querySelector('#app') ||
          document.querySelector('#root')
        );

        // Check for hash routing
        const hasHashRouting = window.location.hash.includes('#/');

        return {
          hasReactRouter,
          hasVueRouter,
          hasAngularRouter,
          hasHistoryAPI,
          hasSPAIndicators,
          hasHashRouting,
          currentUrl: window.location.href
        };
      });

      // Analyze routing type based on indicators
      if (routingInfo.hasHashRouting) {
        return 'client-side';
      }

      if (routingInfo.hasSPAIndicators && routingInfo.hasHistoryAPI) {
        if (routingInfo.hasReactRouter || routingInfo.hasVueRouter || routingInfo.hasAngularRouter) {
          return 'client-side';
        }
        return 'hybrid';
      }

      if (routingInfo.hasHistoryAPI && routingInfo.hasSPAIndicators) {
        return 'hybrid';
      }

      // Check network activity for navigation patterns
      const navigationRequests = this.networkLogs.filter(log => 
        log.resourceType === 'document' || 
        log.resourceType === 'xhr' || 
        log.resourceType === 'fetch'
      );

      if (navigationRequests.length === 0) {
        return 'client-side';
      }

      return 'server-side';
    } catch (error) {
      console.log(`Failed to detect routing type: ${error.message}`);
      return 'unknown';
    }
  }

  /**
   * Generate a comprehensive diagnostic report
   */
  public async generateDiagnosticReport(pageName: string, expectedUrl?: string): Promise<DiagnosticReport> {
    const diagnostics = await this.analyzeNavigationState(pageName, expectedUrl);
    const viewport = await this.getCurrentViewportCategory();
    
    const recommendations = this.generateRecommendations(diagnostics, pageName);
    const severity = this.calculateSeverity(diagnostics);

    return {
      timestamp: new Date().toISOString(),
      pageName,
      viewport,
      diagnostics,
      recommendations,
      severity
    };
  }

  /**
   * Generate actionable recommendations based on diagnostics
   */
  private generateRecommendations(diagnostics: NavigationDiagnostics, pageName: string): string[] {
    const recommendations: string[] = [];

    // URL mismatch recommendations
    if (diagnostics.currentUrl !== diagnostics.expectedUrl) {
      recommendations.push(`URL mismatch detected. Expected: ${diagnostics.expectedUrl}, Actual: ${diagnostics.currentUrl}`);
      
      if (diagnostics.routingType === 'client-side') {
        recommendations.push('Application uses client-side routing. Consider using JavaScript navigation methods.');
      } else if (diagnostics.routingType === 'unknown') {
        recommendations.push('Routing type could not be determined. Check for JavaScript errors or loading issues.');
      }
    }

    // Navigation element recommendations
    const navigationElements = diagnostics.navigationElementsFound.filter(el => 
      el.elementName.includes('navigation') || el.elementName.includes('link')
    );

    const missingElements = navigationElements.filter(el => !el.isPresent);
    const invisibleElements = navigationElements.filter(el => el.isPresent && !el.isVisible);
    const unclickableElements = navigationElements.filter(el => el.isPresent && el.isVisible && !el.isClickable);

    if (missingElements.length > 0) {
      recommendations.push(`Missing navigation elements: ${missingElements.map(el => el.elementName).join(', ')}`);
      recommendations.push('Check if navigation selectors match the actual application structure.');
    }

    if (invisibleElements.length > 0) {
      recommendations.push(`Invisible navigation elements: ${invisibleElements.map(el => el.elementName).join(', ')}`);
      recommendations.push('Elements may be hidden by CSS or loading states. Check display, visibility, and opacity styles.');
    }

    if (unclickableElements.length > 0) {
      recommendations.push(`Non-clickable navigation elements: ${unclickableElements.map(el => el.elementName).join(', ')}`);
      recommendations.push('Elements may be disabled or have pointer-events: none. Check element state and CSS.');
    }

    // Application state recommendations
    if (diagnostics.applicationState.loadingIndicators) {
      recommendations.push('Loading indicators detected. Wait for loading to complete before attempting navigation.');
    }

    if (diagnostics.applicationState.errorMessages.length > 0) {
      recommendations.push(`Application errors detected: ${diagnostics.applicationState.errorMessages.join(', ')}`);
      recommendations.push('Resolve application errors before attempting navigation.');
    }

    if (diagnostics.javascriptErrors.length > 0) {
      recommendations.push(`JavaScript errors detected: ${diagnostics.javascriptErrors.length} errors`);
      recommendations.push('Check browser console for JavaScript errors that may prevent navigation.');
    }

    // Network activity recommendations
    const failedRequests = diagnostics.networkActivity.filter(log => log.status >= 400);
    if (failedRequests.length > 0) {
      recommendations.push(`Failed network requests detected: ${failedRequests.length} requests`);
      recommendations.push('Check network connectivity and server availability.');
    }

    // Authentication recommendations
    if (!diagnostics.applicationState.isAuthenticated) {
      recommendations.push('User appears to be unauthenticated. Ensure proper authentication before navigation.');
    }

    return recommendations;
  }

  /**
   * Calculate severity level based on diagnostics
   */
  private calculateSeverity(diagnostics: NavigationDiagnostics): 'low' | 'medium' | 'high' | 'critical' {
    let severityScore = 0;

    // URL mismatch
    if (diagnostics.currentUrl !== diagnostics.expectedUrl) {
      severityScore += 3;
    }

    // Missing navigation elements
    const missingElements = diagnostics.navigationElementsFound.filter(el => !el.isPresent).length;
    severityScore += missingElements * 2;

    // JavaScript errors
    severityScore += diagnostics.javascriptErrors.length;

    // Application errors
    severityScore += diagnostics.applicationState.errorMessages.length * 2;

    // Failed network requests
    const failedRequests = diagnostics.networkActivity.filter(log => log.status >= 400).length;
    severityScore += failedRequests;

    // Loading indicators (minor issue)
    if (diagnostics.applicationState.loadingIndicators) {
      severityScore += 1;
    }

    // Determine severity level
    if (severityScore >= 10) return 'critical';
    if (severityScore >= 6) return 'high';
    if (severityScore >= 3) return 'medium';
    return 'low';
  }

  /**
   * Get current viewport category
   */
  private async getCurrentViewportCategory(): Promise<string> {
    const viewport = this.page.viewportSize();
    if (!viewport) return 'unknown';
    
    return NavigationConstants.getViewportCategoryByWidth(viewport.width);
  }

  /**
   * Clear diagnostic data
   */
  public clearDiagnosticData(): void {
    this.networkLogs = [];
    this.jsErrors = [];
  }

  /**
   * Export diagnostic data for external analysis
   */
  public exportDiagnosticData(): {
    networkLogs: NetworkActivityLog[];
    jsErrors: JavaScriptError[];
  } {
    return {
      networkLogs: [...this.networkLogs],
      jsErrors: [...this.jsErrors]
    };
  }
}