/**
 * Demonstration script showing how to use the comprehensive validation methods
 * This demonstrates the implementation of task 8: Create comprehensive test validation methods
 */

import NavigationPage from '../pages/NavigationPage';
import UIActions from '../../support/playwright/actions/UIActions';

/**
 * Example usage of comprehensive validation methods
 * This would typically be used in actual test scenarios
 */
export class ValidationMethodsDemo {
    private navigationPage: NavigationPage;

    constructor(uiActions: UIActions) {
        this.navigationPage = new NavigationPage(uiActions);
    }

    /**
     * Demonstrate comprehensive page load validation
     */
    async demonstratePageLoadValidation(pageName: string): Promise<void> {
        console.log(`\n🔍 Demonstrating comprehensive page load validation for ${pageName}...`);
        
        try {
            // Use the comprehensive page load validation method
            const result = await this.navigationPage.validatePageLoadWithPerformance(pageName, 10000);
            
            console.log(`✅ Page load validation completed:`);
            console.log(`   - Overall valid: ${result.isValid}`);
            console.log(`   - Load time: ${result.loadTime}ms`);
            console.log(`   - Timeout exceeded: ${result.timeoutExceeded}`);
            console.log(`   - Performance metrics available: ${Object.keys(result.performanceMetrics).length} metrics`);
            console.log(`   - Validation errors: ${result.errors.length}`);
            
            if (result.errors.length > 0) {
                console.log(`   - Errors:`);
                result.errors.forEach(error => console.log(`     - ${error}`));
            }
            
        } catch (error) {
            console.log(`❌ Page load validation failed: ${error.message}`);
        }
    }

    /**
     * Demonstrate URL pattern validation
     */
    async demonstrateUrlValidation(pageName: string): Promise<void> {
        console.log(`\n🔗 Demonstrating URL pattern validation for ${pageName}...`);
        
        try {
            const currentUrl = await this.navigationPage.getCurrentUrl();
            const result = await this.navigationPage.validateUrlPattern(currentUrl, pageName);
            
            console.log(`✅ URL validation completed:`);
            console.log(`   - Valid: ${result.isValid}`);
            console.log(`   - Expected pattern: ${result.expectedPattern}`);
            console.log(`   - Actual URL: ${result.actualUrl}`);
            console.log(`   - Path matches: ${result.matchDetails.pathMatches}`);
            console.log(`   - Query params valid: ${result.matchDetails.queryParamsValid}`);
            console.log(`   - Fragment valid: ${result.matchDetails.fragmentValid}`);
            
        } catch (error) {
            console.log(`❌ URL validation failed: ${error.message}`);
        }
    }

    /**
     * Demonstrate page title validation
     */
    async demonstrateTitleValidation(pageName: string): Promise<void> {
        console.log(`\n📄 Demonstrating page title validation for ${pageName}...`);
        
        try {
            const currentTitle = await this.navigationPage.getCurrentTitle();
            const result = await this.navigationPage.validatePageTitle(currentTitle, pageName);
            
            console.log(`✅ Title validation completed:`);
            console.log(`   - Valid: ${result.isValid}`);
            console.log(`   - Expected title: ${result.expectedTitle}`);
            console.log(`   - Actual title: ${result.actualTitle}`);
            console.log(`   - Match type: ${result.matchType}`);
            
        } catch (error) {
            console.log(`❌ Title validation failed: ${error.message}`);
        }
    }

    /**
     * Demonstrate element presence validation
     */
    async demonstrateElementValidation(pageName: string): Promise<void> {
        console.log(`\n📋 Demonstrating element presence validation for ${pageName}...`);
        
        try {
            const result = await this.navigationPage.validateRequiredElements(pageName);
            
            console.log(`✅ Element validation completed:`);
            console.log(`   - Valid: ${result.isValid}`);
            console.log(`   - Total elements: ${result.totalElements}`);
            console.log(`   - Present elements: ${result.presentElements}`);
            console.log(`   - Missing elements: ${result.missingElements.length}`);
            
            if (result.missingElements.length > 0) {
                console.log(`   - Missing:`);
                result.missingElements.forEach(missing => console.log(`     - ${missing}`));
            }
            
            console.log(`   - Element details:`);
            result.elementDetails.forEach(detail => {
                console.log(`     - ${detail.name}: Present=${detail.isPresent}, Visible=${detail.isVisible}, Interactable=${detail.isInteractable}`);
            });
            
        } catch (error) {
            console.log(`❌ Element validation failed: ${error.message}`);
        }
    }

    /**
     * Demonstrate performance measurement and validation
     */
    async demonstratePerformanceValidation(): Promise<void> {
        console.log(`\n⚡ Demonstrating performance measurement and validation...`);
        
        try {
            const result = await this.navigationPage.measureAndValidatePerformance();
            
            console.log(`✅ Performance validation completed:`);
            console.log(`   - Valid: ${result.isValid}`);
            console.log(`   - Load time: ${result.metrics.loadTime}ms (threshold: ${result.thresholds.loadTime}ms)`);
            console.log(`   - DOM content loaded: ${result.metrics.domContentLoaded}ms (threshold: ${result.thresholds.domContentLoaded}ms)`);
            console.log(`   - First contentful paint: ${result.metrics.firstContentfulPaint}ms (threshold: ${result.thresholds.firstContentfulPaint}ms)`);
            console.log(`   - Largest contentful paint: ${result.metrics.largestContentfulPaint}ms (threshold: ${result.thresholds.largestContentfulPaint}ms)`);
            console.log(`   - Time to interactive: ${result.metrics.timeToInteractive}ms`);
            
            console.log(`   - Validation results:`);
            console.log(`     - Load time valid: ${result.validationResults.loadTimeValid}`);
            console.log(`     - DOM content loaded valid: ${result.validationResults.domContentLoadedValid}`);
            console.log(`     - First contentful paint valid: ${result.validationResults.firstContentfulPaintValid}`);
            console.log(`     - Largest contentful paint valid: ${result.validationResults.largestContentfulPaintValid}`);
            
            if (result.errors.length > 0) {
                console.log(`   - Errors: ${result.errors.length}`);
                result.errors.forEach(error => console.log(`     - ${error}`));
            }
            
            if (result.warnings.length > 0) {
                console.log(`   - Warnings: ${result.warnings.length}`);
                result.warnings.forEach(warning => console.log(`     - ${warning}`));
            }
            
        } catch (error) {
            console.log(`❌ Performance validation failed: ${error.message}`);
        }
    }

    /**
     * Run all validation demonstrations
     */
    async runAllDemonstrations(pageName: string = 'home'): Promise<void> {
        console.log(`\n🚀 Running comprehensive validation methods demonstration for ${pageName}...`);
        console.log(`${'='.repeat(80)}`);
        
        await this.demonstratePageLoadValidation(pageName);
        await this.demonstrateUrlValidation(pageName);
        await this.demonstrateTitleValidation(pageName);
        await this.demonstrateElementValidation(pageName);
        await this.demonstratePerformanceValidation();
        
        console.log(`\n${'='.repeat(80)}`);
        console.log(`✅ All validation method demonstrations completed!`);
        console.log(`\nThese methods provide comprehensive validation capabilities for:`);
        console.log(`• Page load validation with timeout handling and performance checks`);
        console.log(`• URL pattern matching and page title verification`);
        console.log(`• Element presence validation for required page components`);
        console.log(`• Load time measurement and performance validation functionality`);
        console.log(`\nRequirements satisfied: 1.3, 1.4, 5.1, 5.3`);
    }
}

// Export for use in actual test files
export default ValidationMethodsDemo;