// Script to inspect available selectors on the current page
// Run this in browser console or as a Playwright script

const inspectSelectors = () => {
    console.log('=== NAVIGATION ELEMENTS ===');
    
    // Look for navigation elements
    const navElements = document.querySelectorAll('nav, .nav, .navbar, .navigation, [role="navigation"]');
    navElements.forEach((el, i) => {
        console.log(`Nav ${i}:`, {
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            testId: el.getAttribute('data-testid'),
            innerHTML: el.innerHTML.substring(0, 100) + '...'
        });
    });
    
    console.log('\n=== NAVIGATION LINKS ===');
    
    // Look for navigation links
    const links = document.querySelectorAll('a[href*="ticket"], a[href*="customer"], a[href*="route"], a[href*="report"], a[href*="dashboard"]');
    links.forEach((el, i) => {
        console.log(`Link ${i}:`, {
            href: el.href,
            text: el.textContent.trim(),
            className: el.className,
            id: el.id,
            testId: el.getAttribute('data-testid')
        });
    });
    
    console.log('\n=== SEARCH ELEMENTS ===');
    
    // Look for search elements
    const searchElements = document.querySelectorAll('input[type="search"], input[placeholder*="search" i], .search, [data-testid*="search"]');
    searchElements.forEach((el, i) => {
        console.log(`Search ${i}:`, {
            tagName: el.tagName,
            type: el.type,
            placeholder: el.placeholder,
            className: el.className,
            id: el.id,
            testId: el.getAttribute('data-testid')
        });
    });
    
    console.log('\n=== PAGE IDENTIFIERS ===');
    
    // Look for page identifiers
    const pageElements = document.querySelectorAll('h1, .page-title, .page-header, [data-testid*="page"]');
    pageElements.forEach((el, i) => {
        console.log(`Page Element ${i}:`, {
            tagName: el.tagName,
            text: el.textContent.trim(),
            className: el.className,
            id: el.id,
            testId: el.getAttribute('data-testid')
        });
    });
};

// Run the inspection
inspectSelectors();