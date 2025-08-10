/**
 * Test file for comprehensive navigation validation methods
 * Tests the implementation of task 8: Create comprehensive test validation methods
 */

import { test, expect } from '@playwright/test';
import NavigationPage from '../pages/NavigationPage';
import UIActions from '../../support/playwright/actions/UIActions';

test.describe('Navigation Validation Methods', () => {
    let navigationPage: NavigationPage;
    let uiActions: UIActions;

    test.beforeEach(async ({ page }) => {
        uiActions = new UIActions(page);
        navigationPage = new NavigationPage(uiActions);
        
        // Navigate to base URL for testing
        await page.goto(process.env.BASE_URL || 'http://localhost:3000');
    });

    test('should validate page load with performance metrics', async () => {
        // Test comprehensive page load validation
        const result = await navigationPage.validatePageLoadWithPerformance('home', 10000);
        
        expect(result).toBeDefined();
        expect(result.loadTime).toBeGreaterThan(0);
        expect(result.performanceMetrics).toBeDefined();
        expect(result.validationResults).toBeDefined();
        expect(typeof result.isValid).toBe('boolean');
        expect(Array.isArray(result.errors)).toBe(true);
        
        console.log('Page load validation result:', JSON.stringify(result, null, 2));
    });

    test('should validate URL patterns correctly', async () => {
        const currentUrl = await navigationPage.getCurrentUrl();
        const result = await navigationPage.validateUrlPattern(currentUrl, 'home');
        
        expect(result).toBeDefined();
        expect(result.actualUrl).toBe(currentUrl);
        expect(result.expectedPattern).toBeDefined();
        expect(result.matchDetails).toBeDefined();
        expect(typeof result.isValid).toBe('boolean');
        expect(Array.isArray(result.errors)).toBe(true);
        
        console.log('URL validation result:', JSON.stringify(result, null, 2));
    });

    test('should validate page titles correctly', async () => {
        const currentTitle = await navigationPage.getCurrentTitle();
        const result = await navigationPage.validatePageTitle(currentTitle, 'home');
        
        expect(result).toBeDefined();
        expect(result.actualTitle).toBe(currentTitle);
        expect(result.expectedTitle).toBeDefined();
        expect(['exact', 'contains', 'pattern', 'none']).toContain(result.matchType);
        expect(typeof result.isValid).toBe('boolean');
        expect(Array.isArray(result.errors)).toBe(true);
        
        console.log('Title validation result:', JSON.stringify(result, null, 2));
    });

    test('should validate required elements presence', async () => {
        const result = await navigationPage.validateRequiredElements('home');
        
        expect(result).toBeDefined();
        expect(result.totalElements).toBeGreaterThan(0);
        expect(result.presentElements).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(result.missingElements)).toBe(true);
        expect(Array.isArray(result.elementDetails)).toBe(true);
        expect(Array.isArray(result.errors)).toBe(true);
        expect(typeof result.isValid).toBe('boolean');
        
        // Validate element details structure
        result.elementDetails.forEach(detail => {
            expect(detail.selector).toBeDefined();
            expect(detail.name).toBeDefined();
            expect(typeof detail.isPresent).toBe('boolean');
            expect(typeof detail.isVisible).toBe('boolean');
            expect(typeof detail.isInteractable).toBe('boolean');
        });
        
        console.log('Element validation result:', JSON.stringify(result, null, 2));
    });

    test('should measure and validate performance metrics', async () => {
        const result = await navigationPage.measureAndValidatePerformance();
        
        expect(result).toBeDefined();
        expect(result.metrics).toBeDefined();
        expect(result.thresholds).toBeDefined();
        expect(result.validationResults).toBeDefined();
        expect(typeof result.isValid).toBe('boolean');
        expect(Array.isArray(result.errors)).toBe(true);
        expect(Array.isArray(result.warnings)).toBe(true);
        
        // Validate metrics structure
        expect(typeof result.metrics.loadTime).toBe('number');
        expect(typeof result.metrics.domContentLoaded).toBe('number');
        expect(typeof result.metrics.firstContentfulPaint).toBe('number');
        expect(typeof result.metrics.largestContentfulPaint).toBe('number');
        
        // Validate thresholds structure
        expect(typeof result.thresholds.loadTime).toBe('number');
        expect(typeof result.thresholds.domContentLoaded).toBe('number');
        expect(typeof result.thresholds.firstContentfulPaint).toBe('number');
        expect(typeof result.thresholds.largestContentfulPaint).toBe('number');
        
        // Validate validation results structure
        expect(typeof result.validationResults.loadTimeValid).toBe('boolean');
        expect(typeof result.validationResults.domContentLoadedValid).toBe('boolean');
        expect(typeof result.validationResults.firstContentfulPaintValid).toBe('boolean');
        expect(typeof result.validationResults.largestContentfulPaintValid).toBe('boolean');
        
        console.log('Performance validation result:', JSON.stringify(result, null, 2));
    });

    test('should handle validation errors gracefully', async () => {
        // Test with invalid page name
        const result = await navigationPage.validateRequiredElements('invalid-page');
        
        expect(result).toBeDefined();
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0]).toContain('Page configuration not found');
        
        console.log('Error handling test result:', JSON.stringify(result, null, 2));
    });

    test('should validate different viewport categories', async ({ page }) => {
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        const mobileResult = await navigationPage.measureAndValidatePerformance();
        expect(mobileResult.thresholds.loadTime).toBe(8000); // Mobile threshold
        
        // Test tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        const tabletResult = await navigationPage.measureAndValidatePerformance();
        expect(tabletResult.thresholds.loadTime).toBe(6000); // Tablet threshold
        
        // Test desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 });
        const desktopResult = await navigationPage.measureAndValidatePerformance();
        expect(desktopResult.thresholds.loadTime).toBe(5000); // Desktop threshold
        
        console.log('Viewport-specific thresholds validated successfully');
    });
});