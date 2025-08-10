import { Page, Locator } from '@playwright/test';
import NavigationConstants from '../constants/NavigationConstants';

/**
 * Interfaces for element detection
 */
export interface ElementDetectionStrategy {
  name: string;
  priority: number;
  detect(page: Page, pageName: string, elementType: ElementType): Promise<ElementDetectionResult>;
}

export interface ElementDetectionResult {
  success: boolean;
  elements: DetectedElement[];
  strategy: string;
  confidence: number;
  executionTime: number;
}

export interface DetectedElement {
  selector: string;
  element: Locator;
  isVisible: boolean;
  isClickable: boolean;
  boundingBox: { x: number; y: number; width: number; height: number } | null;
  attributes: Record<string, string>;
  confidence: number;
  elementType: ElementType;
}

export enum ElementType {
  NAVIGATION_LINK = 'navigation-link',
  PAGE_IDENTIFIER = 'page-identifier',
  SEARCH_INTERFACE = 'search-interface',
  MOBILE_MENU_TOGGLE = 'mobile-menu-toggle',
  MOBILE_MENU_CONTAINER = 'mobile-menu-container',
  LOADING_INDICATOR = 'loading-indicator',
  ERROR_MESSAGE = 'error-message',
  MAIN_CONTENT = 'main-content'
}

/**
 * ElementDetectionSystem - Advanced element detection with multiple strategies
 * 
 * This system provides comprehensive element detection using various strategies:
 * - Attribute-based detection (data-testid, data-nav, etc.)
 * - CSS class-based detection
 * - Content-based detection (text matching)
 * - Structural detection (DOM hierarchy analysis)
 * - Heuristic detection (intelligent guessing based on patterns)
 */
export class ElementDetectionSystem {
  private page: Page;
  private strategies: ElementDetectionStrategy[];

  constructor(page: Page) {
    this.page = page;
    this.strategies = [
      new AttributeBasedDetectionStrategy(),
      new CSSClassDetectionStrategy(),
      new ContentBasedDetectionStrategy(),
      new StructuralDetectionStrategy(),
      new HeuristicDetectionStrategy()
    ];
  }

  /**
   * Detect elements using all available strategies
   */
  public async detectElements(pageName: string, elementType: ElementType): Promise<ElementDetectionResult> {
    console.log(`Detecting ${elementType} elements for ${pageName} page...`);

    const results: ElementDetectionResult[] = [];
    
    // Run all strategies in parallel for better performance
    const strategyPromises = this.strategies.map(strategy => 
      strategy.detect(this.page, pageName, elementType)
        .catch(error => ({
          success: false,
          elements: [],
          strategy: strategy.name,
          confidence: 0,
          executionTime: 0
        }))
    );

    const strategyResults = await Promise.all(strategyPromises);
    results.push(...strategyResults);

    // Combine and rank results
    const combinedResult = this.combineResults(results, elementType);
    
    console.log(`Element detection completed. Found ${combinedResult.elements.length} elements with ${combinedResult.confidence}% confidence`);
    return combinedResult;
  }

  /**
   * Detect specific navigation elements for a page
   */
  public async detectNavigationElements(pageName: string): Promise<{
    navigationLinks: DetectedElement[];
    pageIdentifiers: DetectedElement[];
    searchInterface: DetectedElement[];
    mobileMenuElements: DetectedElement[];
  }> {
    const [navigationLinks, pageIdentifiers, searchInterface, mobileMenuToggle, mobileMenuContainer] = await Promise.all([
      this.detectElements(pageName, ElementType.NAVIGATION_LINK),
      this.detectElements(pageName, ElementType.PAGE_IDENTIFIER),
      this.detectElements(pageName, ElementType.SEARCH_INTERFACE),
      this.detectElements(pageName, ElementType.MOBILE_MENU_TOGGLE),
      this.detectElements(pageName, ElementType.MOBILE_MENU_CONTAINER)
    ]);

    return {
      navigationLinks: navigationLinks.elements,
      pageIdentifiers: pageIdentifiers.elements,
      searchInterface: searchInterface.elements,
      mobileMenuElements: [...mobileMenuToggle.elements, ...mobileMenuContainer.elements]
    };
  }

  /**
   * Combine results from multiple strategies
   */
  private combineResults(results: ElementDetectionResult[], elementType: ElementType): ElementDetectionResult {
    const allElements: DetectedElement[] = [];
    const seenSelectors = new Set<string>();
    let totalConfidence = 0;
    let totalExecutionTime = 0;
    let successfulStrategies = 0;

    // Sort results by confidence and priority
    const sortedResults = results
      .filter(result => result.success)
      .sort((a, b) => b.confidence - a.confidence);

    // Combine elements, avoiding duplicates
    for (const result of sortedResults) {
      totalConfidence += result.confidence;
      totalExecutionTime += result.executionTime;
      successfulStrategies++;

      for (const element of result.elements) {
        if (!seenSelectors.has(element.selector)) {
          seenSelectors.add(element.selector);
          allElements.push(element);
        }
      }
    }

    // Calculate average confidence
    const averageConfidence = successfulStrategies > 0 ? totalConfidence / successfulStrategies : 0;

    return {
      success: allElements.length > 0,
      elements: allElements,
      strategy: 'combined',
      confidence: averageConfidence,
      executionTime: totalExecutionTime
    };
  }

  /**
   * Validate detected elements
   */
  public async validateDetectedElements(elements: DetectedElement[]): Promise<DetectedElement[]> {
    const validatedElements: DetectedElement[] = [];

    for (const element of elements) {
      try {
        // Re-check element state
        const isVisible = await element.element.isVisible({ timeout: 1000 });
        const isClickable = isVisible && await element.element.isEnabled({ timeout: 1000 });
        const boundingBox = await element.element.boundingBox();

        // Update element with current state
        const validatedElement: DetectedElement = {
          ...element,
          isVisible,
          isClickable,
          boundingBox
        };

        validatedElements.push(validatedElement);
      } catch (error) {
        // Element is no longer valid, skip it
        console.log(`Element validation failed for ${element.selector}: ${error.message}`);
      }
    }

    return validatedElements;
  }

  /**
   * Score element effectiveness based on various factors
   */
  public scoreElementEffectiveness(element: DetectedElement): number {
    let score = 0;

    // Visibility score (40% weight)
    if (element.isVisible) score += 40;

    // Clickability score (30% weight)
    if (element.isClickable) score += 30;

    // Selector reliability score (20% weight)
    if (element.selector.includes('[data-testid')) score += 20;
    else if (element.selector.includes('[data-')) score += 15;
    else if (element.selector.includes('.')) score += 10;
    else if (element.selector.includes('#')) score += 5;

    // Size score (10% weight)
    if (element.boundingBox) {
      const area = element.boundingBox.width * element.boundingBox.height;
      if (area > 1000) score += 10; // Reasonable size
      else if (area > 100) score += 5; // Small but visible
    }

    return Math.min(score, 100);
  }
}

/**
 * Attribute-based detection strategy
 * Looks for elements with specific data attributes
 */
class AttributeBasedDetectionStrategy implements ElementDetectionStrategy {
  name = 'attribute-based';
  priority = 1;

  async detect(page: Page, pageName: string, elementType: ElementType): Promise<ElementDetectionResult> {
    const startTime = Date.now();
    const elements: DetectedElement[] = [];

    const selectors = this.getAttributeSelectors(pageName, elementType);

    for (const selector of selectors) {
      try {
        const locator = page.locator(selector);
        const count = await locator.count();

        for (let i = 0; i < count; i++) {
          const element = locator.nth(i);
          const isVisible = await element.isVisible({ timeout: 1000 });
          const isClickable = isVisible && await element.isEnabled({ timeout: 1000 });
          const boundingBox = await element.boundingBox();
          const attributes = await this.getElementAttributes(element);

          elements.push({
            selector,
            element,
            isVisible,
            isClickable,
            boundingBox,
            attributes,
            confidence: 90, // High confidence for attribute-based detection
            elementType
          });
        }
      } catch (error) {
        // Selector failed, continue with next
      }
    }

    return {
      success: elements.length > 0,
      elements,
      strategy: this.name,
      confidence: elements.length > 0 ? 90 : 0,
      executionTime: Date.now() - startTime
    };
  }

  private getAttributeSelectors(pageName: string, elementType: ElementType): string[] {
    switch (elementType) {
      case ElementType.NAVIGATION_LINK:
        return [
          `[data-testid="${pageName}-link"]`,
          `[data-testid="nav-${pageName}"]`,
          `[data-nav="${pageName}"]`,
          `[data-page="${pageName}"]`,
          `[data-testid="navigation-${pageName}"]`
        ];
      case ElementType.PAGE_IDENTIFIER:
        return [
          `[data-testid="${pageName}-page"]`,
          `[data-page="${pageName}"]`,
          `[data-testid="page-${pageName}"]`,
          `[data-testid="${pageName}-container"]`
        ];
      case ElementType.SEARCH_INTERFACE:
        return [
          `[data-testid="${pageName}-search"]`,
          `[data-testid="search-${pageName}"]`,
          `[data-search="${pageName}"]`,
          `[data-testid="search-interface"]`,
          `[data-search]`
        ];
      case ElementType.MOBILE_MENU_TOGGLE:
        return [
          `[data-testid="mobile-menu-toggle"]`,
          `[data-testid="mobile-nav-toggle"]`,
          `[data-mobile-menu]`,
          `[data-testid="hamburger-menu"]`
        ];
      case ElementType.MOBILE_MENU_CONTAINER:
        return [
          `[data-testid="mobile-menu-container"]`,
          `[data-testid="mobile-menu"]`,
          `[data-mobile-nav]`,
          `[data-testid="mobile-navigation"]`
        ];
      default:
        return [];
    }
  }

  private async getElementAttributes(element: Locator): Promise<Record<string, string>> {
    try {
      return await element.evaluate((el) => {
        const attrs: Record<string, string> = {};
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          attrs[attr.name] = attr.value;
        }
        return attrs;
      });
    } catch (error) {
      return {};
    }
  }
}

/**
 * CSS class-based detection strategy
 * Looks for elements with specific CSS classes
 */
class CSSClassDetectionStrategy implements ElementDetectionStrategy {
  name = 'css-class-based';
  priority = 2;

  async detect(page: Page, pageName: string, elementType: ElementType): Promise<ElementDetectionResult> {
    const startTime = Date.now();
    const elements: DetectedElement[] = [];

    const selectors = this.getCSSSelectors(pageName, elementType);

    for (const selector of selectors) {
      try {
        const locator = page.locator(selector);
        const count = await locator.count();

        for (let i = 0; i < count; i++) {
          const element = locator.nth(i);
          const isVisible = await element.isVisible({ timeout: 1000 });
          const isClickable = isVisible && await element.isEnabled({ timeout: 1000 });
          const boundingBox = await element.boundingBox();
          const attributes = await this.getElementAttributes(element);

          elements.push({
            selector,
            element,
            isVisible,
            isClickable,
            boundingBox,
            attributes,
            confidence: 70, // Medium confidence for CSS-based detection
            elementType
          });
        }
      } catch (error) {
        // Selector failed, continue with next
      }
    }

    return {
      success: elements.length > 0,
      elements,
      strategy: this.name,
      confidence: elements.length > 0 ? 70 : 0,
      executionTime: Date.now() - startTime
    };
  }

  private getCSSSelectors(pageName: string, elementType: ElementType): string[] {
    switch (elementType) {
      case ElementType.NAVIGATION_LINK:
        return [
          `.nav-${pageName}`,
          `.${pageName}-link`,
          `.menu-${pageName}`,
          `.navigation-${pageName}`,
          `.nav-item.${pageName}`
        ];
      case ElementType.PAGE_IDENTIFIER:
        return [
          `.${pageName}-page`,
          `.page-${pageName}`,
          `.${pageName}-container`,
          `.container-${pageName}`,
          `.main-${pageName}`
        ];
      case ElementType.SEARCH_INTERFACE:
        return [
          `.${pageName}-search`,
          `.search-${pageName}`,
          `.search-container`,
          `.search-interface`,
          `.search-wrapper`
        ];
      case ElementType.MOBILE_MENU_TOGGLE:
        return [
          '.mobile-menu-toggle',
          '.hamburger-menu',
          '.menu-toggle',
          '.navbar-toggle',
          '.mobile-nav-toggle'
        ];
      case ElementType.MOBILE_MENU_CONTAINER:
        return [
          '.mobile-menu',
          '.mobile-nav',
          '.mobile-navigation',
          '.navbar-collapse',
          '.mobile-menu-container'
        ];
      default:
        return [];
    }
  }

  private async getElementAttributes(element: Locator): Promise<Record<string, string>> {
    try {
      return await element.evaluate((el) => {
        const attrs: Record<string, string> = {};
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          attrs[attr.name] = attr.value;
        }
        return attrs;
      });
    } catch (error) {
      return {};
    }
  }
}

/**
 * Content-based detection strategy
 * Looks for elements based on their text content
 */
class ContentBasedDetectionStrategy implements ElementDetectionStrategy {
  name = 'content-based';
  priority = 3;

  async detect(page: Page, pageName: string, elementType: ElementType): Promise<ElementDetectionResult> {
    const startTime = Date.now();
    const elements: DetectedElement[] = [];

    const selectors = this.getContentSelectors(pageName, elementType);

    for (const selector of selectors) {
      try {
        const locator = page.locator(selector);
        const count = await locator.count();

        for (let i = 0; i < count; i++) {
          const element = locator.nth(i);
          const isVisible = await element.isVisible({ timeout: 1000 });
          const isClickable = isVisible && await element.isEnabled({ timeout: 1000 });
          const boundingBox = await element.boundingBox();
          const attributes = await this.getElementAttributes(element);

          elements.push({
            selector,
            element,
            isVisible,
            isClickable,
            boundingBox,
            attributes,
            confidence: 60, // Lower confidence for content-based detection
            elementType
          });
        }
      } catch (error) {
        // Selector failed, continue with next
      }
    }

    return {
      success: elements.length > 0,
      elements,
      strategy: this.name,
      confidence: elements.length > 0 ? 60 : 0,
      executionTime: Date.now() - startTime
    };
  }

  private getContentSelectors(pageName: string, elementType: ElementType): string[] {
    const capitalizedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    
    switch (elementType) {
      case ElementType.NAVIGATION_LINK:
        return [
          `a:has-text("${capitalizedPageName}")`,
          `a:has-text("${pageName}")`,
          `button:has-text("${capitalizedPageName}")`,
          `[role="button"]:has-text("${capitalizedPageName}")`,
          `*:has-text("${capitalizedPageName}")[href]`
        ];
      case ElementType.PAGE_IDENTIFIER:
        return [
          `h1:has-text("${capitalizedPageName}")`,
          `h2:has-text("${capitalizedPageName}")`,
          `.page-title:has-text("${capitalizedPageName}")`,
          `.title:has-text("${capitalizedPageName}")`,
          `*:has-text("${capitalizedPageName} Page")`
        ];
      case ElementType.SEARCH_INTERFACE:
        return [
          `input[placeholder*="Search"]`,
          `input[placeholder*="search"]`,
          `*:has-text("Search")`,
          `[type="search"]`,
          `input[name*="search"]`
        ];
      case ElementType.MOBILE_MENU_TOGGLE:
        return [
          `*:has-text("Menu")`,
          `*:has-text("☰")`,
          `*:has-text("≡")`,
          `button:has-text("Toggle")`,
          `*[aria-label*="menu"]`
        ];
      default:
        return [];
    }
  }

  private async getElementAttributes(element: Locator): Promise<Record<string, string>> {
    try {
      return await element.evaluate((el) => {
        const attrs: Record<string, string> = {};
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          attrs[attr.name] = attr.value;
        }
        return attrs;
      });
    } catch (error) {
      return {};
    }
  }
}

/**
 * Structural detection strategy
 * Analyzes DOM structure to find elements
 */
class StructuralDetectionStrategy implements ElementDetectionStrategy {
  name = 'structural';
  priority = 4;

  async detect(page: Page, pageName: string, elementType: ElementType): Promise<ElementDetectionResult> {
    const startTime = Date.now();
    const elements: DetectedElement[] = [];

    const selectors = this.getStructuralSelectors(pageName, elementType);

    for (const selector of selectors) {
      try {
        const locator = page.locator(selector);
        const count = await locator.count();

        for (let i = 0; i < count; i++) {
          const element = locator.nth(i);
          const isVisible = await element.isVisible({ timeout: 1000 });
          const isClickable = isVisible && await element.isEnabled({ timeout: 1000 });
          const boundingBox = await element.boundingBox();
          const attributes = await this.getElementAttributes(element);

          elements.push({
            selector,
            element,
            isVisible,
            isClickable,
            boundingBox,
            attributes,
            confidence: 50, // Lower confidence for structural detection
            elementType
          });
        }
      } catch (error) {
        // Selector failed, continue with next
      }
    }

    return {
      success: elements.length > 0,
      elements,
      strategy: this.name,
      confidence: elements.length > 0 ? 50 : 0,
      executionTime: Date.now() - startTime
    };
  }

  private getStructuralSelectors(pageName: string, elementType: ElementType): string[] {
    switch (elementType) {
      case ElementType.NAVIGATION_LINK:
        return [
          `nav a[href*="${pageName}"]`,
          `.navbar a[href*="${pageName}"]`,
          `.navigation a[href*="${pageName}"]`,
          `header a[href*="${pageName}"]`,
          `.menu a[href*="${pageName}"]`,
          `ul.nav a[href*="${pageName}"]`
        ];
      case ElementType.PAGE_IDENTIFIER:
        return [
          `main .${pageName}`,
          `.content .${pageName}`,
          `#content .${pageName}`,
          `.main-content .${pageName}`,
          `body > .${pageName}`
        ];
      case ElementType.SEARCH_INTERFACE:
        return [
          `form input[type="search"]`,
          `.search form input`,
          `header input[type="search"]`,
          `.navbar input[type="search"]`,
          `nav input[type="search"]`
        ];
      case ElementType.MOBILE_MENU_TOGGLE:
        return [
          `header button`,
          `.navbar button`,
          `nav button`,
          `.mobile button`,
          `header .toggle`
        ];
      case ElementType.MOBILE_MENU_CONTAINER:
        return [
          `.navbar .collapse`,
          `nav .menu`,
          `header .menu`,
          `.mobile .nav`,
          `.sidebar`
        ];
      default:
        return [];
    }
  }

  private async getElementAttributes(element: Locator): Promise<Record<string, string>> {
    try {
      return await element.evaluate((el) => {
        const attrs: Record<string, string> = {};
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          attrs[attr.name] = attr.value;
        }
        return attrs;
      });
    } catch (error) {
      return {};
    }
  }
}

/**
 * Heuristic detection strategy
 * Uses intelligent patterns and common conventions
 */
class HeuristicDetectionStrategy implements ElementDetectionStrategy {
  name = 'heuristic';
  priority = 5;

  async detect(page: Page, pageName: string, elementType: ElementType): Promise<ElementDetectionResult> {
    const startTime = Date.now();
    const elements: DetectedElement[] = [];

    const selectors = await this.getHeuristicSelectors(page, pageName, elementType);

    for (const selector of selectors) {
      try {
        const locator = page.locator(selector);
        const count = await locator.count();

        for (let i = 0; i < count; i++) {
          const element = locator.nth(i);
          const isVisible = await element.isVisible({ timeout: 1000 });
          const isClickable = isVisible && await element.isEnabled({ timeout: 1000 });
          const boundingBox = await element.boundingBox();
          const attributes = await this.getElementAttributes(element);

          elements.push({
            selector,
            element,
            isVisible,
            isClickable,
            boundingBox,
            attributes,
            confidence: 40, // Lowest confidence for heuristic detection
            elementType
          });
        }
      } catch (error) {
        // Selector failed, continue with next
      }
    }

    return {
      success: elements.length > 0,
      elements,
      strategy: this.name,
      confidence: elements.length > 0 ? 40 : 0,
      executionTime: Date.now() - startTime
    };
  }

  private async getHeuristicSelectors(page: Page, pageName: string, elementType: ElementType): Promise<string[]> {
    // Analyze page structure to generate intelligent selectors
    const pageStructure = await this.analyzePage(page);
    
    switch (elementType) {
      case ElementType.NAVIGATION_LINK:
        return this.generateNavigationLinkSelectors(pageStructure, pageName);
      case ElementType.PAGE_IDENTIFIER:
        return this.generatePageIdentifierSelectors(pageStructure, pageName);
      case ElementType.SEARCH_INTERFACE:
        return this.generateSearchInterfaceSelectors(pageStructure);
      case ElementType.MOBILE_MENU_TOGGLE:
        return this.generateMobileMenuToggleSelectors(pageStructure);
      default:
        return [];
    }
  }

  private async analyzePage(page: Page): Promise<any> {
    return await page.evaluate(() => {
      const analysis = {
        hasNavTag: !!document.querySelector('nav'),
        hasHeaderTag: !!document.querySelector('header'),
        hasMainTag: !!document.querySelector('main'),
        hasNavbarClass: !!document.querySelector('.navbar'),
        hasMenuClass: !!document.querySelector('.menu'),
        hasNavigationClass: !!document.querySelector('.navigation'),
        linkCount: document.querySelectorAll('a').length,
        buttonCount: document.querySelectorAll('button').length,
        inputCount: document.querySelectorAll('input').length
      };
      return analysis;
    });
  }

  private generateNavigationLinkSelectors(pageStructure: any, pageName: string): string[] {
    const selectors: string[] = [];
    
    // Generate selectors based on page structure
    if (pageStructure.hasNavTag) {
      selectors.push(`nav a[href*="${pageName}"]`);
    }
    if (pageStructure.hasHeaderTag) {
      selectors.push(`header a[href*="${pageName}"]`);
    }
    if (pageStructure.hasNavbarClass) {
      selectors.push(`.navbar a[href*="${pageName}"]`);
    }
    
    // Fallback generic selectors
    selectors.push(`a[href*="${pageName}"]`);
    selectors.push(`a[href*="/${pageName}"]`);
    
    return selectors;
  }

  private generatePageIdentifierSelectors(pageStructure: any, pageName: string): string[] {
    const selectors: string[] = [];
    
    if (pageStructure.hasMainTag) {
      selectors.push(`main`);
    }
    
    selectors.push(`.main-content`);
    selectors.push(`.content`);
    selectors.push(`#content`);
    selectors.push(`body`);
    
    return selectors;
  }

  private generateSearchInterfaceSelectors(pageStructure: any): string[] {
    const selectors: string[] = [];
    
    if (pageStructure.inputCount > 0) {
      selectors.push(`input[type="text"]`);
      selectors.push(`input[type="search"]`);
      selectors.push(`input[placeholder*="search" i]`);
    }
    
    return selectors;
  }

  private generateMobileMenuToggleSelectors(pageStructure: any): string[] {
    const selectors: string[] = [];
    
    if (pageStructure.buttonCount > 0) {
      selectors.push(`button`);
    }
    
    if (pageStructure.hasHeaderTag) {
      selectors.push(`header button`);
    }
    
    if (pageStructure.hasNavbarClass) {
      selectors.push(`.navbar button`);
    }
    
    return selectors;
  }

  private async getElementAttributes(element: Locator): Promise<Record<string, string>> {
    try {
      return await element.evaluate((el) => {
        const attrs: Record<string, string> = {};
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          attrs[attr.name] = attr.value;
        }
        return attrs;
      });
    } catch (error) {
      return {};
    }
  }
}