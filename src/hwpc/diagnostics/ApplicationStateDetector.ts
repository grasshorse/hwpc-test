import { Page } from '@playwright/test';

/**
 * Interfaces for application state detection
 */
export interface AuthenticationState {
  isAuthenticated: boolean;
  authMethod: 'session' | 'token' | 'cookie' | 'unknown';
  userId?: string;
  username?: string;
  sessionToken?: string;
  expirationTime?: number;
  permissions?: string[];
}

export interface LoadingState {
  hasLoadingIndicators: boolean;
  loadingElements: LoadingElement[];
  isPageLoading: boolean;
  estimatedLoadingTime?: number;
}

export interface LoadingElement {
  selector: string;
  type: 'spinner' | 'progress' | 'skeleton' | 'overlay' | 'text' | 'unknown';
  isVisible: boolean;
  message?: string;
}

export interface ErrorState {
  hasErrors: boolean;
  errorMessages: ErrorMessage[];
  consoleErrors: ConsoleError[];
  networkErrors: NetworkError[];
}

export interface ErrorMessage {
  message: string;
  type: 'validation' | 'network' | 'authentication' | 'permission' | 'general';
  element?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ConsoleError {
  message: string;
  source: string;
  line: number;
  column: number;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
}

export interface NetworkError {
  url: string;
  status: number;
  statusText: string;
  timestamp: number;
}

export interface ApplicationState {
  authentication: AuthenticationState;
  loading: LoadingState;
  errors: ErrorState;
  pageReadiness: PageReadinessState;
  timestamp: number;
}

export interface PageReadinessState {
  domReady: boolean;
  imagesLoaded: boolean;
  scriptsLoaded: boolean;
  stylesLoaded: boolean;
  networkIdle: boolean;
  readinessScore: number; // 0-100
}

/**
 * ApplicationStateDetector - Comprehensive application state analysis
 * 
 * This class detects and analyzes various aspects of application state that can affect navigation:
 * - Authentication status and user session
 * - Loading states and indicators
 * - Error conditions and messages
 * - Page readiness and resource loading
 * - JavaScript execution state
 */
export class ApplicationStateDetector {
  private page: Page;
  private consoleErrors: ConsoleError[] = [];
  private networkErrors: NetworkError[] = [];
  private isMonitoring: boolean = false;

  constructor(page: Page) {
    this.page = page;
    this.setupErrorMonitoring();
  }

  /**
   * Setup error monitoring
   */
  private setupErrorMonitoring(): void {
    // Console error monitoring
    this.page.on('console', (msg) => {
      if (!this.isMonitoring) return;
      
      if (msg.type() === 'error' || msg.type() === 'warning') {
        this.consoleErrors.push({
          message: msg.text(),
          source: 'console',
          line: 0,
          column: 0,
          timestamp: Date.now(),
          level: msg.type() as 'error' | 'warning'
        });
      }
    });

    // Page error monitoring
    this.page.on('pageerror', (error) => {
      if (!this.isMonitoring) return;
      
      this.consoleErrors.push({
        message: error.message,
        source: error.stack || 'unknown',
        line: 0,
        column: 0,
        timestamp: Date.now(),
        level: 'error'
      });
    });

    // Network error monitoring
    this.page.on('response', (response) => {
      if (!this.isMonitoring) return;
      
      if (response.status() >= 400) {
        this.networkErrors.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: Date.now()
        });
      }
    });
  }

  /**
   * Start monitoring application state
   */
  public startMonitoring(): void {
    this.isMonitoring = true;
    this.consoleErrors = [];
    this.networkErrors = [];
  }

  /**
   * Stop monitoring application state
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
  }

  /**
   * Detect comprehensive application state
   */
  public async detectApplicationState(): Promise<ApplicationState> {
    console.log('Detecting application state...');

    const [authentication, loading, errors, pageReadiness] = await Promise.all([
      this.detectAuthenticationState(),
      this.detectLoadingState(),
      this.detectErrorState(),
      this.detectPageReadinessState()
    ]);

    const state: ApplicationState = {
      authentication,
      loading,
      errors,
      pageReadiness,
      timestamp: Date.now()
    };

    console.log('Application state detection completed');
    return state;
  }

  /**
   * Detect authentication state
   */
  public async detectAuthenticationState(): Promise<AuthenticationState> {
    try {
      const authState = await this.page.evaluate(() => {
        // Check localStorage for authentication data
        const localStorageAuth = {
          authUser: localStorage.getItem('auth_user'),
          sessionToken: localStorage.getItem('session_token'),
          userId: localStorage.getItem('user_id'),
          username: localStorage.getItem('username'),
          userPermissions: localStorage.getItem('user_permissions'),
          tokenExpiry: localStorage.getItem('token_expiry')
        };

        // Check sessionStorage for authentication data
        const sessionStorageAuth = {
          authUser: sessionStorage.getItem('auth_user'),
          sessionToken: sessionStorage.getItem('session_token'),
          userId: sessionStorage.getItem('user_id'),
          username: sessionStorage.getItem('username')
        };

        // Check cookies for authentication
        const cookies = document.cookie;
        const hasAuthCookie = cookies.includes('mvp_session') || 
                             cookies.includes('auth_token') || 
                             cookies.includes('session_id');

        // Check for authentication indicators in DOM
        const authIndicators = {
          loginForm: !!document.querySelector('form[action*="login"], .login-form, [data-testid="login-form"]'),
          logoutButton: !!document.querySelector('button[onclick*="logout"], .logout-btn, [data-testid="logout-button"]'),
          userProfile: !!document.querySelector('.user-profile, .profile, [data-testid="user-profile"]'),
          authError: !!document.querySelector('.auth-error, .login-error, [data-testid="auth-error"]')
        };

        // Check for user-specific content
        const userContent = {
          welcomeMessage: document.querySelector('.welcome, [data-testid="welcome-message"]')?.textContent,
          userMenu: !!document.querySelector('.user-menu, [data-testid="user-menu"]'),
          dashboardContent: !!document.querySelector('.dashboard, [data-testid="dashboard"]')
        };

        return {
          localStorageAuth,
          sessionStorageAuth,
          hasAuthCookie,
          authIndicators,
          userContent
        };
      });

      // Determine authentication status
      const isAuthenticated = !!(
        authState.localStorageAuth.authUser ||
        authState.localStorageAuth.sessionToken ||
        authState.sessionStorageAuth.authUser ||
        authState.sessionStorageAuth.sessionToken ||
        authState.hasAuthCookie ||
        authState.authIndicators.logoutButton ||
        authState.userContent.userMenu
      );

      // Determine authentication method
      let authMethod: 'session' | 'token' | 'cookie' | 'unknown' = 'unknown';
      if (authState.localStorageAuth.sessionToken || authState.sessionStorageAuth.sessionToken) {
        authMethod = 'token';
      } else if (authState.hasAuthCookie) {
        authMethod = 'cookie';
      } else if (authState.localStorageAuth.authUser || authState.sessionStorageAuth.authUser) {
        authMethod = 'session';
      }

      // Extract user information
      const userId = authState.localStorageAuth.userId || authState.sessionStorageAuth.userId;
      const username = authState.localStorageAuth.username || authState.sessionStorageAuth.username;
      const sessionToken = authState.localStorageAuth.sessionToken || authState.sessionStorageAuth.sessionToken;
      
      // Parse permissions
      let permissions: string[] = [];
      try {
        if (authState.localStorageAuth.userPermissions) {
          permissions = JSON.parse(authState.localStorageAuth.userPermissions);
        }
      } catch (error) {
        // Invalid permissions format
      }

      // Parse expiration time
      let expirationTime: number | undefined;
      try {
        if (authState.localStorageAuth.tokenExpiry) {
          expirationTime = parseInt(authState.localStorageAuth.tokenExpiry);
        }
      } catch (error) {
        // Invalid expiration format
      }

      return {
        isAuthenticated,
        authMethod,
        userId: userId || undefined,
        username: username || undefined,
        sessionToken: sessionToken || undefined,
        expirationTime,
        permissions
      };
    } catch (error) {
      console.log(`Authentication state detection failed: ${error.message}`);
      return {
        isAuthenticated: false,
        authMethod: 'unknown'
      };
    }
  }

  /**
   * Detect loading state
   */
  public async detectLoadingState(): Promise<LoadingState> {
    try {
      const loadingInfo = await this.page.evaluate(() => {
        // Common loading indicator selectors
        const loadingSelectors = [
          '.loading',
          '.spinner',
          '.loader',
          '.progress',
          '.skeleton',
          '.loading-overlay',
          '[data-loading="true"]',
          '[data-testid="loading"]',
          '[data-testid="spinner"]',
          '.fa-spinner',
          '.fa-circle-o-notch',
          '.loading-dots',
          '.progress-bar'
        ];

        const loadingElements: Array<{
          selector: string;
          type: string;
          isVisible: boolean;
          message?: string;
        }> = [];

        for (const selector of loadingSelectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element, index) => {
            const htmlElement = element as HTMLElement;
            const isVisible = htmlElement.offsetParent !== null && 
                             window.getComputedStyle(element).visibility !== 'hidden' &&
                             window.getComputedStyle(element).opacity !== '0';
            
            if (isVisible) {
              loadingElements.push({
                selector: `${selector}:nth-child(${index + 1})`,
                type: determineLoadingType(selector, element),
                isVisible,
                message: element.textContent?.trim() || undefined
              });
            }
          });
        }

        function determineLoadingType(selector: string, element: Element): string {
          if (selector.includes('spinner') || selector.includes('fa-spinner')) return 'spinner';
          if (selector.includes('progress')) return 'progress';
          if (selector.includes('skeleton')) return 'skeleton';
          if (selector.includes('overlay')) return 'overlay';
          if (selector.includes('loading')) return 'text';
          return 'unknown';
        }

        // Check document ready state
        const isPageLoading = document.readyState !== 'complete';

        // Check for network activity indicators
        const hasNetworkActivity = !!(window as any).fetch || !!(window as any).XMLHttpRequest;

        return {
          loadingElements,
          isPageLoading,
          hasNetworkActivity,
          readyState: document.readyState
        };
      });

      // Determine loading type for each element
      const loadingElements: LoadingElement[] = loadingInfo.loadingElements.map(el => ({
        selector: el.selector,
        type: this.categorizeLoadingType(el.type),
        isVisible: el.isVisible,
        message: el.message
      }));

      const hasLoadingIndicators = loadingElements.length > 0;

      // Estimate loading time based on indicators
      let estimatedLoadingTime: number | undefined;
      if (hasLoadingIndicators) {
        // Simple heuristic: more loading indicators = longer estimated time
        estimatedLoadingTime = Math.min(loadingElements.length * 2000, 10000); // 2s per indicator, max 10s
      }

      return {
        hasLoadingIndicators,
        loadingElements,
        isPageLoading: loadingInfo.isPageLoading,
        estimatedLoadingTime
      };
    } catch (error) {
      console.log(`Loading state detection failed: ${error.message}`);
      return {
        hasLoadingIndicators: false,
        loadingElements: [],
        isPageLoading: false
      };
    }
  }

  /**
   * Detect error state
   */
  public async detectErrorState(): Promise<ErrorState> {
    try {
      const domErrors = await this.page.evaluate(() => {
        // Common error message selectors
        const errorSelectors = [
          '.error',
          '.alert-danger',
          '.alert-error',
          '.error-message',
          '.validation-error',
          '.field-error',
          '[data-error]',
          '[data-testid="error"]',
          '[data-testid="error-message"]',
          '.text-danger',
          '.has-error',
          '.is-invalid',
          '.error-text'
        ];

        const errorMessages: Array<{
          message: string;
          type: string;
          element: string;
          severity: string;
        }> = [];

        for (const selector of errorSelectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            const htmlElement = element as HTMLElement;
            const isVisible = htmlElement.offsetParent !== null && 
                             window.getComputedStyle(element).visibility !== 'hidden';
            
            if (isVisible && element.textContent?.trim()) {
              errorMessages.push({
                message: element.textContent.trim(),
                type: categorizeErrorType(element.textContent.trim(), selector),
                element: selector,
                severity: determineSeverity(element.textContent.trim(), selector)
              });
            }
          });
        }

        function categorizeErrorType(message: string, element: string): string {
          const lowerMessage = message.toLowerCase();
          const lowerElement = element.toLowerCase();

          if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('unauthorized')) {
            return 'authentication';
          }
          if (lowerMessage.includes('permission') || lowerMessage.includes('forbidden') || lowerMessage.includes('access denied')) {
            return 'permission';
          }
          if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('timeout')) {
            return 'network';
          }
          if (lowerElement.includes('validation') || lowerMessage.includes('required') || lowerMessage.includes('invalid')) {
            return 'validation';
          }
          return 'general';
        }

        function determineSeverity(message: string, selector: string): string {
          const lowerMessage = message.toLowerCase();
          const lowerSelector = selector.toLowerCase();

          if (lowerMessage.includes('critical') || lowerMessage.includes('fatal') || lowerSelector.includes('critical')) {
            return 'critical';
          }
          if (lowerMessage.includes('error') || lowerSelector.includes('error')) {
            return 'high';
          }
          if (lowerMessage.includes('warning') || lowerSelector.includes('warning')) {
            return 'medium';
          }
          return 'low';
        }

        return errorMessages;
      });

      // Convert DOM errors to ErrorMessage format
      const errorMessages: ErrorMessage[] = domErrors.map(error => ({
        message: error.message,
        type: this.categorizeErrorType(error.message, error.element),
        element: error.element,
        severity: this.categorizeSeverity(error.severity)
      }));

      // Add console errors
      const consoleErrors = [...this.consoleErrors];

      // Add network errors
      const networkErrors = [...this.networkErrors];

      const hasErrors = errorMessages.length > 0 || consoleErrors.length > 0 || networkErrors.length > 0;

      return {
        hasErrors,
        errorMessages,
        consoleErrors,
        networkErrors
      };
    } catch (error) {
      console.log(`Error state detection failed: ${error.message}`);
      return {
        hasErrors: false,
        errorMessages: [],
        consoleErrors: [...this.consoleErrors],
        networkErrors: [...this.networkErrors]
      };
    }
  }

  /**
   * Detect page readiness state
   */
  public async detectPageReadinessState(): Promise<PageReadinessState> {
    try {
      const readinessInfo = await this.page.evaluate(() => {
        // Check DOM ready state
        const domReady = document.readyState === 'complete';

        // Check if images are loaded
        const images = document.querySelectorAll('img');
        let imagesLoaded = true;
        images.forEach(img => {
          if (!img.complete || img.naturalHeight === 0) {
            imagesLoaded = false;
          }
        });

        // Check if scripts are loaded
        const scripts = document.querySelectorAll('script[src]');
        let scriptsLoaded = true;
        // Note: This is a simplified check, actual script loading is harder to detect

        // Check if stylesheets are loaded
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        let stylesLoaded = true;
        // Note: This is a simplified check, actual stylesheet loading is harder to detect

        // Check for common loading indicators
        const loadingIndicators = document.querySelectorAll('.loading, .spinner, .loader, [data-loading="true"]');
        const hasLoadingIndicators = Array.from(loadingIndicators).some(el => {
          const htmlElement = el as HTMLElement;
          return htmlElement.offsetParent !== null && window.getComputedStyle(el).visibility !== 'hidden';
        });

        return {
          domReady,
          imagesLoaded,
          scriptsLoaded,
          stylesLoaded,
          hasLoadingIndicators,
          imageCount: images.length,
          scriptCount: scripts.length,
          stylesheetCount: stylesheets.length
        };
      });

      // Network idle is harder to detect, we'll assume it's idle if no loading indicators
      const networkIdle = !readinessInfo.hasLoadingIndicators;

      // Calculate readiness score (0-100)
      let readinessScore = 0;
      if (readinessInfo.domReady) readinessScore += 30;
      if (readinessInfo.imagesLoaded) readinessScore += 20;
      if (readinessInfo.scriptsLoaded) readinessScore += 20;
      if (readinessInfo.stylesLoaded) readinessScore += 15;
      if (networkIdle) readinessScore += 15;

      return {
        domReady: readinessInfo.domReady,
        imagesLoaded: readinessInfo.imagesLoaded,
        scriptsLoaded: readinessInfo.scriptsLoaded,
        stylesLoaded: readinessInfo.stylesLoaded,
        networkIdle,
        readinessScore
      };
    } catch (error) {
      console.log(`Page readiness detection failed: ${error.message}`);
      return {
        domReady: false,
        imagesLoaded: false,
        scriptsLoaded: false,
        stylesLoaded: false,
        networkIdle: false,
        readinessScore: 0
      };
    }
  }

  /**
   * Wait for application to be ready for navigation
   */
  public async waitForApplicationReady(timeout: number = 10000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const state = await this.detectApplicationState();
      
      // Check if application is ready
      const isReady = !state.loading.hasLoadingIndicators &&
                     !state.loading.isPageLoading &&
                     state.pageReadiness.readinessScore >= 80 &&
                     !state.errors.hasErrors;
      
      if (isReady) {
        return true;
      }
      
      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return false; // Timeout reached
  }

  /**
   * Generate application state summary
   */
  public async generateStateSummary(): Promise<{
    isReady: boolean;
    issues: string[];
    recommendations: string[];
    state: ApplicationState;
  }> {
    const state = await this.detectApplicationState();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check authentication issues
    if (!state.authentication.isAuthenticated) {
      issues.push('User is not authenticated');
      recommendations.push('Ensure proper authentication before attempting navigation');
    }

    // Check loading issues
    if (state.loading.hasLoadingIndicators) {
      issues.push(`${state.loading.loadingElements.length} loading indicators detected`);
      recommendations.push('Wait for loading to complete before navigation');
    }

    // Check error issues
    if (state.errors.hasErrors) {
      issues.push(`${state.errors.errorMessages.length} error messages detected`);
      recommendations.push('Resolve application errors before navigation');
    }

    if (state.errors.consoleErrors.length > 0) {
      issues.push(`${state.errors.consoleErrors.length} console errors detected`);
      recommendations.push('Check browser console for JavaScript errors');
    }

    // Check readiness issues
    if (state.pageReadiness.readinessScore < 80) {
      issues.push(`Page readiness score is low (${state.pageReadiness.readinessScore}%)`);
      recommendations.push('Wait for page resources to load completely');
    }

    const isReady = issues.length === 0;

    return {
      isReady,
      issues,
      recommendations,
      state
    };
  }

  /**
   * Clear monitoring data
   */
  public clearMonitoringData(): void {
    this.consoleErrors = [];
    this.networkErrors = [];
  }

  /**
   * Helper method to categorize loading type
   */
  private categorizeLoadingType(type: string): 'spinner' | 'progress' | 'skeleton' | 'overlay' | 'text' | 'unknown' {
    if (type.includes('spinner') || type.includes('fa-spinner')) return 'spinner';
    if (type.includes('progress')) return 'progress';
    if (type.includes('skeleton')) return 'skeleton';
    if (type.includes('overlay')) return 'overlay';
    if (type.includes('loading')) return 'text';
    return 'unknown';
  }

  /**
   * Helper method to categorize error type
   */
  private categorizeErrorType(message: string, element: string): 'validation' | 'network' | 'authentication' | 'permission' | 'general' {
    const lowerMessage = message.toLowerCase();
    const lowerElement = element.toLowerCase();

    if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('unauthorized')) {
      return 'authentication';
    }
    if (lowerMessage.includes('permission') || lowerMessage.includes('forbidden') || lowerMessage.includes('access denied')) {
      return 'permission';
    }
    if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('timeout')) {
      return 'network';
    }
    if (lowerElement.includes('validation') || lowerMessage.includes('required') || lowerMessage.includes('invalid')) {
      return 'validation';
    }
    return 'general';
  }

  /**
   * Helper method to categorize severity
   */
  private categorizeSeverity(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (severity.toLowerCase()) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      default: return 'low';
    }
  }
}