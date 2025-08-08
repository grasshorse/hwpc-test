import { chromium } from 'playwright';

async function inspectCurrentSelectors() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Replace with your actual test site URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(baseUrl);
    
    console.log('=== INSPECTING CURRENT APPLICATION SELECTORS ===\n');
    
    // Inspect navigation elements
    console.log('NAVIGATION ELEMENTS:');
    const navElements = await page.$$eval('nav, .nav, .navbar, .navigation, [role="navigation"]', elements => 
        elements.map((el, i) => ({
            index: i,
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            testId: el.getAttribute('data-testid'),
            text: el.textContent?.trim().substring(0, 100)
        }))
    );
    console.table(navElements);
    
    // Inspect links that might be navigation
    console.log('\nPOTENTIAL NAVIGATION LINKS:');
    const links = await page.$$eval('a', elements => 
        elements
            .filter(el => {
                const href = el.href;
                const text = el.textContent?.toLowerCase() || '';
                return href.includes('ticket') || href.includes('customer') || 
                       href.includes('route') || href.includes('report') || 
                       href.includes('dashboard') ||
                       text.includes('ticket') || text.includes('customer') ||
                       text.includes('route') || text.includes('report') ||
                       text.includes('dashboard');
            })
            .map(el => ({
                href: el.href,
                text: el.textContent?.trim(),
                className: el.className,
                id: el.id,
                testId: el.getAttribute('data-testid')
            }))
    );
    console.table(links);
    
    // Inspect search elements
    console.log('\nSEARCH ELEMENTS:');
    const searchElements = await page.$$eval('input, .search, [data-testid*="search"]', elements => 
        elements
            .filter(el => {
                const type = el.getAttribute('type');
                const placeholder = el.getAttribute('placeholder') || '';
                const className = el.className;
                return type === 'search' || 
                       placeholder.toLowerCase().includes('search') ||
                       className.includes('search');
            })
            .map(el => ({
                tagName: el.tagName,
                type: el.getAttribute('type'),
                placeholder: el.getAttribute('placeholder'),
                className: el.className,
                id: el.id,
                testId: el.getAttribute('data-testid')
            }))
    );
    console.table(searchElements);
    
    await browser.close();
}

inspectCurrentSelectors().catch(console.error);