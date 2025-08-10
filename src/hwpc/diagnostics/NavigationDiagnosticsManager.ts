import { Page } from '@playwright/test';
import { NavigationDiagnosticsSystem, DiagnosticReport } from './NavigationDiagnostics';
import { ElementDetectionSystem, ElementType } from './ElementDetectionSystem';
import { NetworkActivityMonitor } from './NetworkActivityMonitor';
import { ApplicationStateDetector } from './ApplicationStateDetector';
import * as winston from 'winston';

/**
 * Interfaces for comprehensive diagnostics
 */
export interface ComprehensiveDiagnosticReport {
  timestamp: string;
  pageName: string;
  viewport: string;
  navigationDiagnostics: DiagnosticReport;
  elementDetection: {
    navigationElements: any;
    detectionResults: any[];
  };
  networkActivity: {
    summary: any;
    patterns: any;
    activities: any[];
  };
  applicationState: {
    summary: any;
    state: any;
  };
  overallAssessment: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    isNavigationPossible: boolean;
    blockers: string[];
    recommendations: string[];
    confidence: number;
  };
}

export interface DiagnosticConfiguration {
  enableNetworkMonitoring: boolean;
  enableElementDetection: boolean;
  enableApplicationStateDetection: boolean;
  enableLogging: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  timeouts: {
    elementDetection: number;
    networkIdle: number;
    applicationReady: number;
  };
}

/**
 * NavigationDiagnosticsManager - Central manager for all navigation diagnostics
 * 
 * This class coordinates all diagnostic systems to provide comprehensive navigation analysis:
 * - Navigation state analysis
 * - Element detection with multiple strategies
 * - Network activity monitoring
 * - Application state detection
 * - Integrated reporting and recommendations
 */
export class NavigationDiagnosticsManager {
  private page: Page;
  private navigationDiagnostics: NavigationDiagnosticsSystem;
  private elementDetection: ElementDetectionSystem;
  private networkMonitor: NetworkActivityMonitor;
  private applicationStateDetector: ApplicationStateDetector;
  private logger: winston.Logger;
  private config: DiagnosticConfiguration;

  constructor(page: Page, config?: Partial<DiagnosticConfiguration>) {
    this.page = page;
    this.config = {
      enableNetworkMonitoring: true,
      enableElementDetection: true,
      enableApplicationStateDetection: true,
      enableLogging: true,
      logLevel: 'info',
      timeouts: {
        elementDetection: 5000,
        networkIdle: 3000,
        applicationReady: 10000
      },
      ...config
    };

    // Initialize diagnostic systems
    this.navigationDiagnostics = new NavigationDiagnosticsSystem(page);
    this.elementDetection = new ElementDetectionSystem(page);
    this.networkMonitor = new NetworkActivityMonitor(page);
    this.applicationStateDetector = new ApplicationStateDetector(page);

    // Setup logging
    this.setupLogging();
  }

  /**
   * Setup Winston logging
   */
  private setupLogging(): void {
    if (!this.config.enableLogging) {
      this.logger = winston.createLogger({
        silent: true
      });
      return;
    }

    this.logger = winston.createLogger({
      level: this.config.logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        new winston.transports.File({
          filename: 'logs/navigation-diagnostics.log',
          format: winston.format.json()
        })
      ]
    });
  }

  /**
   * Start comprehensive diagnostics monitoring
   */
  public startDiagnostics(): void {
    this.logger.info('Starting comprehensive navigation diagnostics...');

    if (this.config.enableNetworkMonitoring) {
      this.networkMonitor.startMonitoring();
    }

    if (this.config.enableApplicationStateDetection) {
      this.applicationStateDetector.startMonitoring();
    }

    this.navigationDiagnostics.startMonitoring();
  }

  /**
   * Stop comprehensive diagnostics monitoring
   */
  public stopDiagnostics(): void {
    this.logger.info('Stopping comprehensive navigation diagnostics...');

    this.navigationDiagnostics.stopMonitoring();

    if (this.config.enableNetworkMonitoring) {
      this.networkMonitor.stopMonitoring();
    }

    if (this.config.enableApplicationStateDetection) {
      this.applicationStateDetector.stopMonitoring();
    }
  }

  /**
   * Generate comprehensive diagnostic report
   */
  public async generateComprehensiveReport(pageName: string, expectedUrl?: string): Promise<ComprehensiveDiagnosticReport> {
    this.logger.info(`Generating comprehensive diagnostic report for ${pageName}...`);

    try {
      // Run all diagnostics in parallel for better performance
      const [
        navigationDiagnostics,
        elementDetection,
        networkActivity,
        applicationState
      ] = await Promise.all([
        this.navigationDiagnostics.generateDiagnosticReport(pageName, expectedUrl),
        this.runElementDetection(pageName),
        this.analyzeNetworkActivity(),
        this.analyzeApplicationState()
      ]);

      // Generate overall assessment
      const overallAssessment = this.generateOverallAssessment(
        navigationDiagnostics,
        elementDetection,
        networkActivity,
        applicationState
      );

      const viewport = await this.getCurrentViewportCategory();

      const report: ComprehensiveDiagnosticReport = {
        timestamp: new Date().toISOString(),
        pageName,
        viewport,
        navigationDiagnostics,
        elementDetection,
        networkActivity,
        applicationState,
        overallAssessment
      };

      this.logger.info(`Comprehensive diagnostic report generated with ${overallAssessment.severity} severity`);
      return report;

    } catch (error) {
      this.logger.error(`Failed to generate comprehensive diagnostic report: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run element detection analysis
   */
  private async runElementDetection(pageName: string): Promise<any> {
    if (!this.config.enableElementDetection) {
      return {
        navigationElements: {},
        detectionResults: []
      };
    }

    try {
      const navigationElements = await this.elementDetection.detectNavigationElements(pageName);
      
      const detectionResults = await Promise.all([
        this.elementDetection.detectElements(pageName, ElementType.NAVIGATION_LINK),
        this.elementDetection.detectElements(pageName, ElementType.PAGE_IDENTIFIER),
        this.elementDetection.detectElements(pageName, ElementType.SEARCH_INTERFACE),
        this.elementDetection.detectElements(pageName, ElementType.MOBILE_MENU_TOGGLE)
      ]);

      return {
        navigationElements,
        detectionResults
      };
    } catch (error) {
      this.logger.error(`Element detection failed: ${error.message}`);
      return {
        navigationElements: {},
        detectionResults: []
      };
    }
  }

  /**
   * Analyze network activity
   */
  private async analyzeNetworkActivity(): Promise<any> {
    if (!this.config.enableNetworkMonitoring) {
      return {
        summary: {},
        patterns: {},
        activities: []
      };
    }

    try {
      const summary = this.networkMonitor.generateNavigationNetworkSummary();
      const patterns = this.networkMonitor.analyzeNavigationPatterns();
      const activities = this.networkMonitor.getNetworkActivities();

      return {
        summary,
        patterns,
        activities
      };
    } catch (error) {
      this.logger.error(`Network activity analysis failed: ${error.message}`);
      return {
        summary: {},
        patterns: {},
        activities: []
      };
    }
  }

  /**
   * Analyze application state
   */
  private async analyzeApplicationState(): Promise<any> {
    if (!this.config.enableApplicationStateDetection) {
      return {
        summary: {},
        state: {}
      };
    }

    try {
      const summary = await this.applicationStateDetector.generateStateSummary();
      const state = await this.applicationStateDetector.detectApplicationState();

      return {
        summary,
        state
      };
    } catch (error) {
      this.logger.error(`Application state analysis failed: ${error.message}`);
      return {
        summary: {},
        state: {}
      };
    }
  }

  /**
   * Generate overall assessment based on all diagnostic data
   */
  private generateOverallAssessment(
    navigationDiagnostics: DiagnosticReport,
    elementDetection: any,
    networkActivity: any,
    applicationState: any
  ): ComprehensiveDiagnosticReport['overallAssessment'] {
    const blockers: string[] = [];
    const recommendations: string[] = [];
    let severityScore = 0;
    let confidence = 100;

    // Analyze navigation diagnostics
    if (navigationDiagnostics.severity === 'critical') {
      severityScore += 10;
      blockers.push('Critical navigation issues detected');
    } else if (navigationDiagnostics.severity === 'high') {
      severityScore += 7;
    } else if (navigationDiagnostics.severity === 'medium') {
      severityScore += 4;
    }

    recommendations.push(...navigationDiagnostics.recommendations);

    // Analyze element detection
    if (elementDetection.navigationElements) {
      const navLinks = elementDetection.navigationElements.navigationLinks || [];
      const pageIdentifiers = elementDetection.navigationElements.pageIdentifiers || [];

      if (navLinks.length === 0) {
        severityScore += 5;
        blockers.push('No navigation links detected');
        confidence -= 20;
      }

      if (pageIdentifiers.length === 0) {
        severityScore += 3;
        blockers.push('No page identifiers detected');
        confidence -= 15;
      }

      // Check element effectiveness
      const effectiveNavLinks = navLinks.filter((link: any) => link.isVisible && link.isClickable);
      if (effectiveNavLinks.length === 0 && navLinks.length > 0) {
        severityScore += 4;
        blockers.push('Navigation links are not clickable');
        confidence -= 25;
      }
    }

    // Analyze network activity
    if (networkActivity.summary) {
      const failedRequests = networkActivity.summary.failedRequests || 0;
      if (failedRequests > 0) {
        severityScore += Math.min(failedRequests, 5);
        blockers.push(`${failedRequests} failed network requests`);
        confidence -= Math.min(failedRequests * 5, 20);
      }

      const slowRequests = networkActivity.summary.slowRequests?.length || 0;
      if (slowRequests > 0) {
        severityScore += Math.min(slowRequests, 3);
        recommendations.push(`${slowRequests} slow network requests detected`);
        confidence -= Math.min(slowRequests * 3, 15);
      }
    }

    if (networkActivity.patterns) {
      recommendations.push(...(networkActivity.patterns.recommendations || []));
    }

    // Analyze application state
    if (applicationState.summary) {
      if (!applicationState.summary.isReady) {
        severityScore += 3;
        blockers.push('Application is not ready for navigation');
        confidence -= 20;
      }

      blockers.push(...(applicationState.summary.issues || []));
      recommendations.push(...(applicationState.summary.recommendations || []));
    }

    if (applicationState.state) {
      // Check authentication
      if (!applicationState.state.authentication?.isAuthenticated) {
        severityScore += 2;
        recommendations.push('User authentication may be required');
        confidence -= 10;
      }

      // Check loading state
      if (applicationState.state.loading?.hasLoadingIndicators) {
        severityScore += 2;
        blockers.push('Loading indicators detected');
        confidence -= 15;
      }

      // Check errors
      if (applicationState.state.errors?.hasErrors) {
        severityScore += 4;
        blockers.push('Application errors detected');
        confidence -= 20;
      }
    }

    // Determine overall severity
    let severity: 'low' | 'medium' | 'high' | 'critical';
    if (severityScore >= 15) severity = 'critical';
    else if (severityScore >= 10) severity = 'high';
    else if (severityScore >= 5) severity = 'medium';
    else severity = 'low';

    // Determine if navigation is possible
    const criticalBlockers = blockers.filter(blocker => 
      blocker.includes('Critical') || 
      blocker.includes('not clickable') || 
      blocker.includes('No navigation links')
    );
    const isNavigationPossible = criticalBlockers.length === 0 && severity !== 'critical';

    // Ensure confidence is within bounds
    confidence = Math.max(0, Math.min(100, confidence));

    return {
      severity,
      isNavigationPossible,
      blockers,
      recommendations: [...new Set(recommendations)], // Remove duplicates
      confidence
    };
  }

  /**
   * Wait for optimal navigation conditions
   */
  public async waitForOptimalNavigationConditions(timeout: number = 15000): Promise<boolean> {
    this.logger.info('Waiting for optimal navigation conditions...');
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        // Check if application is ready
        const isAppReady = await this.applicationStateDetector.waitForApplicationReady(2000);
        
        if (!isAppReady) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        // Check if network is idle
        const isNetworkIdle = await this.networkMonitor.waitForNetworkIdle(2000);
        
        if (!isNetworkIdle) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        this.logger.info('Optimal navigation conditions achieved');
        return true;

      } catch (error) {
        this.logger.warn(`Error while waiting for optimal conditions: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.logger.warn('Timeout reached while waiting for optimal navigation conditions');
    return false;
  }

  /**
   * Diagnose navigation failure
   */
  public async diagnoseNavigationFailure(pageName: string, expectedUrl?: string): Promise<{
    report: ComprehensiveDiagnosticReport;
    quickFixes: string[];
    nextSteps: string[];
  }> {
    this.logger.error(`Diagnosing navigation failure for ${pageName}...`);

    const report = await this.generateComprehensiveReport(pageName, expectedUrl);
    
    const quickFixes: string[] = [];
    const nextSteps: string[] = [];

    // Generate quick fixes based on assessment
    if (report.overallAssessment.blockers.includes('No navigation links detected')) {
      quickFixes.push('Update navigation selectors to match actual application elements');
      quickFixes.push('Try direct URL navigation as fallback');
    }

    if (report.overallAssessment.blockers.includes('Navigation links are not clickable')) {
      quickFixes.push('Wait for page loading to complete');
      quickFixes.push('Check for overlaying elements blocking clicks');
      quickFixes.push('Try JavaScript-based navigation');
    }

    if (report.overallAssessment.blockers.includes('Loading indicators detected')) {
      quickFixes.push('Wait for loading indicators to disappear');
      quickFixes.push('Increase navigation timeouts');
    }

    if (report.overallAssessment.blockers.includes('Application errors detected')) {
      quickFixes.push('Resolve application errors before navigation');
      quickFixes.push('Check authentication and permissions');
    }

    // Generate next steps
    if (report.overallAssessment.severity === 'critical') {
      nextSteps.push('Review application logs for critical errors');
      nextSteps.push('Verify application is running correctly');
      nextSteps.push('Check network connectivity');
    }

    if (report.overallAssessment.confidence < 50) {
      nextSteps.push('Update test selectors to match application structure');
      nextSteps.push('Review application changes that may affect navigation');
    }

    nextSteps.push('Review comprehensive diagnostic report for detailed analysis');
    nextSteps.push('Consider implementing alternative navigation strategies');

    return {
      report,
      quickFixes,
      nextSteps
    };
  }

  /**
   * Export diagnostic data for external analysis
   */
  public exportDiagnosticData(): {
    navigationData: any;
    networkData: any;
    applicationData: any;
    configuration: DiagnosticConfiguration;
  } {
    return {
      navigationData: this.navigationDiagnostics.exportDiagnosticData(),
      networkData: this.networkMonitor.exportNetworkData(),
      applicationData: {
        consoleErrors: this.applicationStateDetector['consoleErrors'],
        networkErrors: this.applicationStateDetector['networkErrors']
      },
      configuration: this.config
    };
  }

  /**
   * Clear all diagnostic data
   */
  public clearDiagnosticData(): void {
    this.logger.info('Clearing all diagnostic data...');
    
    this.navigationDiagnostics.clearDiagnosticData();
    this.networkMonitor.clearNetworkData();
    this.applicationStateDetector.clearMonitoringData();
  }

  /**
   * Get current viewport category
   */
  private async getCurrentViewportCategory(): Promise<string> {
    const viewport = this.page.viewportSize();
    if (!viewport) return 'unknown';
    
    if (viewport.width < 768) return 'mobile';
    if (viewport.width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Update diagnostic configuration
   */
  public updateConfiguration(config: Partial<DiagnosticConfiguration>): void {
    this.config = { ...this.config, ...config };
    this.logger.info('Diagnostic configuration updated');
  }

  /**
   * Get diagnostic configuration
   */
  public getConfiguration(): DiagnosticConfiguration {
    return { ...this.config };
  }
}