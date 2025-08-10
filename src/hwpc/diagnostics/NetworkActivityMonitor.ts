import { Page, Request, Response } from '@playwright/test';

/**
 * Interfaces for network monitoring
 */
export interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  postData?: string;
  timestamp: number;
  resourceType: string;
  isNavigationRequest: boolean;
}

export interface NetworkResponse {
  id: string;
  url: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  responseTime: number;
  size: number;
  fromCache: boolean;
  timestamp: number;
}

export interface NetworkActivity {
  request: NetworkRequest;
  response?: NetworkResponse;
  error?: NetworkError;
  duration: number;
  isComplete: boolean;
}

export interface NetworkError {
  message: string;
  code?: string;
  timestamp: number;
}

export interface NavigationNetworkSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  navigationRequests: number;
  averageResponseTime: number;
  totalDataTransferred: number;
  slowRequests: NetworkActivity[];
  failedRequestDetails: NetworkActivity[];
  navigationRequestDetails: NetworkActivity[];
}

/**
 * NetworkActivityMonitor - Comprehensive network activity tracking for navigation diagnostics
 * 
 * This class monitors all network activity during navigation operations to help identify:
 * - Failed requests that might prevent navigation
 * - Slow requests that might cause timeouts
 * - Navigation-specific requests (document, XHR, fetch)
 * - Authentication-related requests
 * - Resource loading patterns
 */
export class NetworkActivityMonitor {
  private page: Page;
  private activities: Map<string, NetworkActivity> = new Map();
  private isMonitoring: boolean = false;
  private requestCounter: number = 0;
  private monitoringStartTime: number = 0;

  constructor(page: Page) {
    this.page = page;
    this.setupNetworkListeners();
  }

  /**
   * Setup network event listeners
   */
  private setupNetworkListeners(): void {
    // Request event listener
    this.page.on('request', (request: Request) => {
      if (!this.isMonitoring) return;
      
      const requestId = this.generateRequestId();
      const networkRequest = this.createNetworkRequest(request, requestId);
      
      const activity: NetworkActivity = {
        request: networkRequest,
        duration: 0,
        isComplete: false
      };
      
      this.activities.set(requestId, activity);
    });

    // Response event listener
    this.page.on('response', (response: Response) => {
      if (!this.isMonitoring) return;
      
      const request = response.request();
      const requestId = this.findRequestId(request.url(), request.method());
      
      if (requestId) {
        const activity = this.activities.get(requestId);
        if (activity) {
          const networkResponse = this.createNetworkResponse(response, requestId);
          activity.response = networkResponse;
          activity.duration = networkResponse.responseTime - activity.request.timestamp;
          activity.isComplete = true;
          
          this.activities.set(requestId, activity);
        }
      }
    });

    // Request failed event listener
    this.page.on('requestfailed', (request: Request) => {
      if (!this.isMonitoring) return;
      
      const requestId = this.findRequestId(request.url(), request.method());
      
      if (requestId) {
        const activity = this.activities.get(requestId);
        if (activity) {
          activity.error = {
            message: request.failure()?.errorText || 'Request failed',
            timestamp: Date.now()
          };
          activity.duration = Date.now() - activity.request.timestamp;
          activity.isComplete = true;
          
          this.activities.set(requestId, activity);
        }
      }
    });
  }

  /**
   * Start monitoring network activity
   */
  public startMonitoring(): void {
    console.log('Starting network activity monitoring...');
    this.isMonitoring = true;
    this.activities.clear();
    this.requestCounter = 0;
    this.monitoringStartTime = Date.now();
  }

  /**
   * Stop monitoring network activity
   */
  public stopMonitoring(): void {
    console.log('Stopping network activity monitoring...');
    this.isMonitoring = false;
  }

  /**
   * Get all network activities
   */
  public getNetworkActivities(): NetworkActivity[] {
    return Array.from(this.activities.values());
  }

  /**
   * Get network activities filtered by criteria
   */
  public getFilteredActivities(filter: {
    resourceType?: string;
    status?: number;
    failed?: boolean;
    navigation?: boolean;
    slow?: boolean;
    slowThreshold?: number;
  }): NetworkActivity[] {
    const activities = this.getNetworkActivities();
    
    return activities.filter(activity => {
      // Resource type filter
      if (filter.resourceType && activity.request.resourceType !== filter.resourceType) {
        return false;
      }
      
      // Status filter
      if (filter.status && activity.response?.status !== filter.status) {
        return false;
      }
      
      // Failed requests filter
      if (filter.failed !== undefined) {
        const isFailed = !!activity.error || (activity.response && activity.response.status >= 400);
        if (filter.failed !== isFailed) {
          return false;
        }
      }
      
      // Navigation requests filter
      if (filter.navigation !== undefined && filter.navigation !== activity.request.isNavigationRequest) {
        return false;
      }
      
      // Slow requests filter
      if (filter.slow !== undefined) {
        const threshold = filter.slowThreshold || 3000; // 3 seconds default
        const isSlow = activity.duration > threshold;
        if (filter.slow !== isSlow) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Generate comprehensive network summary for navigation analysis
   */
  public generateNavigationNetworkSummary(): NavigationNetworkSummary {
    const activities = this.getNetworkActivities();
    const completedActivities = activities.filter(a => a.isComplete);
    
    const successfulRequests = completedActivities.filter(a => 
      !a.error && a.response && a.response.status < 400
    );
    
    const failedRequests = completedActivities.filter(a => 
      a.error || (a.response && a.response.status >= 400)
    );
    
    const navigationRequests = activities.filter(a => a.request.isNavigationRequest);
    
    const slowRequests = completedActivities.filter(a => a.duration > 3000);
    
    const totalResponseTime = completedActivities.reduce((sum, a) => sum + a.duration, 0);
    const averageResponseTime = completedActivities.length > 0 ? totalResponseTime / completedActivities.length : 0;
    
    const totalDataTransferred = completedActivities.reduce((sum, a) => 
      sum + (a.response?.size || 0), 0
    );

    return {
      totalRequests: activities.length,
      successfulRequests: successfulRequests.length,
      failedRequests: failedRequests.length,
      navigationRequests: navigationRequests.length,
      averageResponseTime,
      totalDataTransferred,
      slowRequests,
      failedRequestDetails: failedRequests,
      navigationRequestDetails: navigationRequests
    };
  }

  /**
   * Analyze navigation-specific network patterns
   */
  public analyzeNavigationPatterns(): {
    hasDocumentRequests: boolean;
    hasXHRRequests: boolean;
    hasFetchRequests: boolean;
    hasAuthenticationRequests: boolean;
    hasAPIRequests: boolean;
    routingType: 'server-side' | 'client-side' | 'hybrid' | 'unknown';
    recommendations: string[];
  } {
    const activities = this.getNetworkActivities();
    
    const documentRequests = activities.filter(a => a.request.resourceType === 'document');
    const xhrRequests = activities.filter(a => a.request.resourceType === 'xhr');
    const fetchRequests = activities.filter(a => a.request.resourceType === 'fetch');
    
    const authRequests = activities.filter(a => 
      a.request.url.includes('/auth') || 
      a.request.url.includes('/login') ||
      a.request.url.includes('/session') ||
      a.request.headers['authorization']
    );
    
    const apiRequests = activities.filter(a => 
      a.request.url.includes('/api/') ||
      a.request.url.includes('/v1/') ||
      a.request.url.includes('/graphql') ||
      a.request.headers['content-type']?.includes('application/json')
    );

    // Determine routing type based on network patterns
    let routingType: 'server-side' | 'client-side' | 'hybrid' | 'unknown' = 'unknown';
    
    if (documentRequests.length > 1) {
      routingType = 'server-side';
    } else if (xhrRequests.length > 0 || fetchRequests.length > 0) {
      if (documentRequests.length === 0) {
        routingType = 'client-side';
      } else {
        routingType = 'hybrid';
      }
    } else if (documentRequests.length === 1) {
      routingType = 'server-side';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (activities.length === 0) {
      recommendations.push('No network activity detected. Navigation may be purely client-side or blocked.');
    }
    
    const failedRequests = activities.filter(a => 
      a.error || (a.response && a.response.status >= 400)
    );
    
    if (failedRequests.length > 0) {
      recommendations.push(`${failedRequests.length} failed requests detected. Check network connectivity and server availability.`);
    }
    
    const slowRequests = activities.filter(a => a.duration > 5000);
    if (slowRequests.length > 0) {
      recommendations.push(`${slowRequests.length} slow requests detected (>5s). Consider increasing timeouts.`);
    }
    
    if (routingType === 'client-side') {
      recommendations.push('Client-side routing detected. Use JavaScript navigation methods instead of clicking links.');
    } else if (routingType === 'server-side') {
      recommendations.push('Server-side routing detected. Ensure proper page load waiting after navigation.');
    }
    
    if (authRequests.length > 0 && authRequests.some(a => a.error || (a.response && a.response.status >= 400))) {
      recommendations.push('Authentication requests failed. Verify user authentication before navigation.');
    }

    return {
      hasDocumentRequests: documentRequests.length > 0,
      hasXHRRequests: xhrRequests.length > 0,
      hasFetchRequests: fetchRequests.length > 0,
      hasAuthenticationRequests: authRequests.length > 0,
      hasAPIRequests: apiRequests.length > 0,
      routingType,
      recommendations
    };
  }

  /**
   * Wait for network idle state
   */
  public async waitForNetworkIdle(timeout: number = 5000, idleTime: number = 500): Promise<boolean> {
    const startTime = Date.now();
    let lastActivityTime = Date.now();
    
    // Monitor for new network activity
    const activityCheck = setInterval(() => {
      const currentActivities = this.getNetworkActivities();
      const recentActivities = currentActivities.filter(a => 
        a.request.timestamp > lastActivityTime - idleTime
      );
      
      if (recentActivities.length > 0) {
        lastActivityTime = Date.now();
      }
    }, 100);
    
    try {
      while (Date.now() - startTime < timeout) {
        if (Date.now() - lastActivityTime >= idleTime) {
          clearInterval(activityCheck);
          return true; // Network is idle
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      clearInterval(activityCheck);
      return false; // Timeout reached
    } catch (error) {
      clearInterval(activityCheck);
      throw error;
    }
  }

  /**
   * Export network data for external analysis
   */
  public exportNetworkData(): {
    summary: NavigationNetworkSummary;
    activities: NetworkActivity[];
    patterns: ReturnType<typeof this.analyzeNavigationPatterns>;
    monitoringDuration: number;
  } {
    return {
      summary: this.generateNavigationNetworkSummary(),
      activities: this.getNetworkActivities(),
      patterns: this.analyzeNavigationPatterns(),
      monitoringDuration: this.isMonitoring ? Date.now() - this.monitoringStartTime : 0
    };
  }

  /**
   * Clear all network activity data
   */
  public clearNetworkData(): void {
    this.activities.clear();
    this.requestCounter = 0;
  }

  /**
   * Create network request object from Playwright request
   */
  private createNetworkRequest(request: Request, requestId: string): NetworkRequest {
    const isNavigationRequest = this.isNavigationRequest(request);
    
    return {
      id: requestId,
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      postData: request.postData() || undefined,
      timestamp: Date.now(),
      resourceType: request.resourceType(),
      isNavigationRequest
    };
  }

  /**
   * Create network response object from Playwright response
   */
  private createNetworkResponse(response: Response, requestId: string): NetworkResponse {
    return {
      id: requestId,
      url: response.url(),
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      responseTime: Date.now(),
      size: 0, // Playwright doesn't provide response size directly
      fromCache: response.fromServiceWorker(),
      timestamp: Date.now()
    };
  }

  /**
   * Check if request is navigation-related
   */
  private isNavigationRequest(request: Request): boolean {
    const resourceType = request.resourceType();
    const url = request.url();
    
    // Document requests are always navigation
    if (resourceType === 'document') {
      return true;
    }
    
    // XHR/Fetch requests to navigation endpoints
    if (resourceType === 'xhr' || resourceType === 'fetch') {
      const navigationPatterns = [
        '/navigate',
        '/page',
        '/route',
        '/load',
        '/api/page',
        '/api/navigation'
      ];
      
      return navigationPatterns.some(pattern => url.includes(pattern));
    }
    
    return false;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${++this.requestCounter}_${Date.now()}`;
  }

  /**
   * Find request ID by URL and method
   */
  private findRequestId(url: string, method: string): string | null {
    for (const [id, activity] of this.activities.entries()) {
      if (activity.request.url === url && activity.request.method === method && !activity.isComplete) {
        return id;
      }
    }
    return null;
  }
}