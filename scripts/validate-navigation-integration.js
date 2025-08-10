#!/usr/bin/env node

/**
 * Navigation Integration Validation Script
 * Validates that navigation testing framework is properly integrated with existing test framework
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Navigation Test Integration...\n');

const validationResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
};

function addResult(type, message, details = '') {
    validationResults[type]++;
    validationResults.details.push({
        type,
        message,
        details,
        timestamp: new Date().toISOString()
    });
    
    const icon = type === 'passed' ? '✅' : type === 'failed' ? '❌' : '⚠️';
    console.log(`${icon} ${message}`);
    if (details) {
        console.log(`   ${details}`);
    }
}

// 1. Check if navigation feature file exists and is properly formatted
function validateFeatureFile() {
    console.log('\n📋 Validating Feature File...');
    
    const featureFilePath = 'features/hwpc/navigate_pages.feature';
    
    if (!fs.existsSync(featureFilePath)) {
        addResult('failed', 'Navigation feature file not found', `Expected: ${featureFilePath}`);
        return;
    }
    
    const featureContent = fs.readFileSync(featureFilePath, 'utf8');
    
    // Check for required tags
    const requiredTags = ['@navigation', '@responsive', '@mobile', '@performance'];
    const missingTags = requiredTags.filter(tag => !featureContent.includes(tag));
    
    if (missingTags.length === 0) {
        addResult('passed', 'All required tags present in feature file');
    } else {
        addResult('failed', 'Missing required tags in feature file', `Missing: ${missingTags.join(', ')}`);
    }
    
    // Check for required scenarios
    const requiredScenarios = [
        'Navigate to main pages with responsive validation',
        'Mobile navigation via mobile menu',
        'Navigation performance validation'
    ];
    
    const missingScenarios = requiredScenarios.filter(scenario => !featureContent.includes(scenario));
    
    if (missingScenarios.length === 0) {
        addResult('passed', 'All required scenarios present in feature file');
    } else {
        addResult('failed', 'Missing required scenarios in feature file', `Missing: ${missingScenarios.join(', ')}`);
    }
}

// 2. Check if navigation step definitions exist
function validateStepDefinitions() {
    console.log('\n🔧 Validating Step Definitions...');
    
    const stepFilePath = 'src/hwpc/steps/NavigationSteps.ts';
    
    if (!fs.existsSync(stepFilePath)) {
        addResult('failed', 'Navigation step definitions file not found', `Expected: ${stepFilePath}`);
        return;
    }
    
    const stepContent = fs.readFileSync(stepFilePath, 'utf8');
    
    // Check for required step definitions
    const requiredSteps = [
        'Given(\'user is on baseurl\'',
        'When(\'the user clicks {string}\'',
        'Then(\'user should be on {string}\'',
        'Then(\'the search interface should be responsive\''
    ];
    
    const missingSteps = requiredSteps.filter(step => !stepContent.includes(step));
    
    if (missingSteps.length === 0) {
        addResult('passed', 'All core step definitions present');
    } else {
        addResult('failed', 'Missing core step definitions', `Missing: ${missingSteps.length} steps`);
    }
    
    // Check for mobile-specific steps
    const mobileSteps = [
        'When(\'the user navigates to {string} via mobile menu\'',
        'Then(\'all touch targets should meet minimum size requirements\''
    ];
    
    const missingMobileSteps = mobileSteps.filter(step => !stepContent.includes(step));
    
    if (missingMobileSteps.length === 0) {
        addResult('passed', 'Mobile-specific step definitions present');
    } else {
        addResult('warnings', 'Some mobile-specific steps may be missing', `Check: ${missingMobileSteps.length} steps`);
    }
}

// 3. Check if page objects exist
function validatePageObjects() {
    console.log('\n📄 Validating Page Objects...');
    
    const pageObjectsPath = 'src/hwpc/pages';
    const requiredPages = [
        'NavigationPage.ts',
        'TicketsPage.ts',
        'CustomersPage.ts',
        'RoutesPage.ts',
        'ReportsPage.ts',
        'DashboardPage.ts'
    ];
    
    if (!fs.existsSync(pageObjectsPath)) {
        addResult('failed', 'Page objects directory not found', `Expected: ${pageObjectsPath}`);
        return;
    }
    
    const missingPages = requiredPages.filter(page => !fs.existsSync(path.join(pageObjectsPath, page)));
    
    if (missingPages.length === 0) {
        addResult('passed', 'All required page objects present');
    } else {
        addResult('failed', 'Missing required page objects', `Missing: ${missingPages.join(', ')}`);
    }
}

// 4. Check if constants are properly configured
function validateConstants() {
    console.log('\n⚙️ Validating Constants...');
    
    const constantsPath = 'src/hwpc/constants';
    const requiredConstants = [
        'NavigationConstants.ts',
        'NavigationTestConfig.ts'
    ];
    
    if (!fs.existsSync(constantsPath)) {
        addResult('failed', 'Constants directory not found', `Expected: ${constantsPath}`);
        return;
    }
    
    const missingConstants = requiredConstants.filter(constant => !fs.existsSync(path.join(constantsPath, constant)));
    
    if (missingConstants.length === 0) {
        addResult('passed', 'All required constants files present');
    } else {
        addResult('failed', 'Missing required constants files', `Missing: ${missingConstants.join(', ')}`);
    }
}

// 5. Check package.json scripts
function validatePackageScripts() {
    console.log('\n📦 Validating Package Scripts...');
    
    const packageJsonPath = 'package.json';
    
    if (!fs.existsSync(packageJsonPath)) {
        addResult('failed', 'package.json not found');
        return;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};
    
    const requiredScripts = [
        'test:navigation',
        'test:navigation:mobile',
        'test:navigation:responsive',
        'test:navigation:performance'
    ];
    
    const missingScripts = requiredScripts.filter(script => !scripts[script]);
    
    if (missingScripts.length === 0) {
        addResult('passed', 'All navigation test scripts present');
    } else {
        addResult('failed', 'Missing navigation test scripts', `Missing: ${missingScripts.join(', ')}`);
    }
    
    // Check if dry run script exists
    if (scripts['dry:test:navigation']) {
        addResult('passed', 'Navigation dry run script present');
    } else {
        addResult('warnings', 'Navigation dry run script not found', 'Consider adding for validation');
    }
}

// 6. Check cucumber configuration
function validateCucumberConfig() {
    console.log('\n🥒 Validating Cucumber Configuration...');
    
    const cucumberConfigPath = 'cucumber.js';
    
    if (!fs.existsSync(cucumberConfigPath)) {
        addResult('failed', 'cucumber.js configuration not found');
        return;
    }
    
    const cucumberConfig = fs.readFileSync(cucumberConfigPath, 'utf8');
    
    // Check if step definitions are properly included
    if (cucumberConfig.includes('--require **/steps/*.ts')) {
        addResult('passed', 'Step definitions properly configured in cucumber.js');
    } else {
        addResult('failed', 'Step definitions not properly configured in cucumber.js');
    }
    
    // Check if hooks are included
    if (cucumberConfig.includes('--require ./src/support/config/hooks.ts')) {
        addResult('passed', 'Hooks properly configured in cucumber.js');
    } else {
        addResult('failed', 'Hooks not properly configured in cucumber.js');
    }
}

// 7. Check CI/CD integration
function validateCIIntegration() {
    console.log('\n🔄 Validating CI/CD Integration...');
    
    const ciConfigPath = '.github/workflows/navigation-tests.yml';
    
    if (!fs.existsSync(ciConfigPath)) {
        addResult('warnings', 'CI/CD workflow file not found', 'Consider adding for automated testing');
        return;
    }
    
    const ciConfig = fs.readFileSync(ciConfigPath, 'utf8');
    
    // Check for required CI jobs
    const requiredJobs = [
        'navigation-tests',
        'navigation-mobile-tests',
        'navigation-performance-tests'
    ];
    
    const missingJobs = requiredJobs.filter(job => !ciConfig.includes(job));
    
    if (missingJobs.length === 0) {
        addResult('passed', 'All required CI/CD jobs present');
    } else {
        addResult('warnings', 'Some CI/CD jobs may be missing', `Check: ${missingJobs.join(', ')}`);
    }
}

// 8. Check reporter integration
function validateReporterIntegration() {
    console.log('\n📊 Validating Reporter Integration...');
    
    const reporterPaths = [
        'src/support/reporter/CucumberReporter.ts',
        'src/support/reporter/HTMLReporter.ts'
    ];
    
    let reportersUpdated = 0;
    
    reporterPaths.forEach(reporterPath => {
        if (fs.existsSync(reporterPath)) {
            const reporterContent = fs.readFileSync(reporterPath, 'utf8');
            
            if (reporterContent.includes('NavigationTestConfig')) {
                reportersUpdated++;
            }
        }
    });
    
    if (reportersUpdated === reporterPaths.length) {
        addResult('passed', 'All reporters updated with navigation metadata');
    } else if (reportersUpdated > 0) {
        addResult('warnings', 'Some reporters updated with navigation metadata', `Updated: ${reportersUpdated}/${reporterPaths.length}`);
    } else {
        addResult('failed', 'Reporters not updated with navigation metadata');
    }
}

// 9. Check hooks integration
function validateHooksIntegration() {
    console.log('\n🪝 Validating Hooks Integration...');
    
    const hooksPath = 'src/support/config/hooks.ts';
    
    if (!fs.existsSync(hooksPath)) {
        addResult('failed', 'Hooks configuration file not found');
        return;
    }
    
    const hooksContent = fs.readFileSync(hooksPath, 'utf8');
    
    // Check for navigation-specific enhancements
    if (hooksContent.includes('isNavigationTest')) {
        addResult('passed', 'Hooks enhanced with navigation-specific artifact collection');
    } else {
        addResult('warnings', 'Hooks may not have navigation-specific enhancements');
    }
    
    // Check for enhanced screenshot naming
    if (hooksContent.includes('navigation-error-')) {
        addResult('passed', 'Enhanced screenshot naming for navigation tests');
    } else {
        addResult('warnings', 'Enhanced screenshot naming may not be implemented');
    }
}

// 10. Validate TypeScript compilation
function validateTypeScriptCompilation() {
    console.log('\n🔧 Validating TypeScript Compilation...');
    
    try {
        const { execSync } = require('child_process');
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
        addResult('passed', 'TypeScript compilation successful');
    } catch (error) {
        addResult('failed', 'TypeScript compilation failed', 'Run "npm run type-check" for details');
    }
}

// Run all validations
async function runValidation() {
    console.log('🚀 Starting Navigation Test Integration Validation\n');
    
    validateFeatureFile();
    validateStepDefinitions();
    validatePageObjects();
    validateConstants();
    validatePackageScripts();
    validateCucumberConfig();
    validateCIIntegration();
    validateReporterIntegration();
    validateHooksIntegration();
    validateTypeScriptCompilation();
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 VALIDATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${validationResults.passed}`);
    console.log(`❌ Failed: ${validationResults.failed}`);
    console.log(`⚠️  Warnings: ${validationResults.warnings}`);
    console.log(`📊 Total Checks: ${validationResults.passed + validationResults.failed + validationResults.warnings}`);
    
    if (validationResults.failed === 0) {
        console.log('\n🎉 Navigation test integration validation PASSED!');
        console.log('✨ Your navigation testing framework is properly integrated.');
        
        if (validationResults.warnings > 0) {
            console.log('\n💡 Consider addressing the warnings above for optimal setup.');
        }
        
        console.log('\n🚀 Next steps:');
        console.log('   1. Run: npm run dry:test:navigation');
        console.log('   2. Run: npm run test:navigation');
        console.log('   3. Check test results in test-results/reports/');
        
        process.exit(0);
    } else {
        console.log('\n❌ Navigation test integration validation FAILED!');
        console.log('🔧 Please address the failed checks above before proceeding.');
        
        console.log('\n📋 Failed checks details:');
        validationResults.details
            .filter(detail => detail.type === 'failed')
            .forEach(detail => {
                console.log(`   - ${detail.message}`);
                if (detail.details) {
                    console.log(`     ${detail.details}`);
                }
            });
        
        process.exit(1);
    }
}

// Run the validation
runValidation().catch(error => {
    console.error('\n💥 Validation script encountered an error:');
    console.error(error.message);
    process.exit(1);
});