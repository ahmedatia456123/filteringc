(function() { // IIFE to avoid polluting global scope
    'use strict';

    // --- Configuration ---
    const categoryRules = [
        {
            slugIdentifier: "/product-category/skin-care/",
            queryParamValue: "skin-care", // Value for 'product_cat'
            filterClass: "benefits-and-uses-for-skin"
        },
        {
            slugIdentifier: "/product-category/hair-care/",
            queryParamValue: "hair-care",
            filterClass: "benefits-and-uses-for-hair"
        },
        {
            slugIdentifier: "/product-category/personal-care/",
            queryParamValue: "personal-care",
            filterClass: "benefits-and-uses-personal"
        }
        // Add more configurations here if needed
    ];
    const queryParamKey = "product_cat"; // The query parameter key we are looking for
    const filterToggleButtonSelector = '.em-button-outline.em-font-semibold.catalog-toolbar__filter-button';
    // --- End Configuration ---

    // Store references to filter elements globally within this scope
    const filterElementsCache = {};

    function queryFilterElements() {
        categoryRules.forEach(rule => {
            const element = document.querySelector('.' + rule.filterClass);
            if (element) {
                filterElementsCache[rule.filterClass] = element;
            } else {
                // Log warning if element was previously found and now isn't, or not found initially
                const previouslyFound = filterElementsCache.hasOwnProperty(rule.filterClass) && filterElementsCache[rule.filterClass];
                if (!element && !previouslyFound) {
                    // console.warn(`Filter element with class "${rule.filterClass}" not found initially.`);
                } else if (!element && previouslyFound) {
                    // console.warn(`Filter element with class "${rule.filterClass}" was found previously but is now missing.`);
                }
                // Ensure it's cleared from cache if not found
                if (!element && previouslyFound) {
                    delete filterElementsCache[rule.filterClass];
                }
            }
        });
    }


    // Helper function to show an element
    function showElement(element) {
        if (element) {
            element.style.display = ''; // Revert to stylesheet-defined display
        }
    }

    // Helper function to hide an element
    function hideElement(element) {
        if (element) {
            element.style.display = 'none';
        }
    }

    // --- Core Logic Function ---
    function updateFilterVisibility() {
        // console.log('updateFilterVisibility called. Current URL:', window.location.href);

        // Re-query elements in case AJAX replaces them or they become available.
        queryFilterElements();

        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const urlParams = new URLSearchParams(currentSearch);
        const productCatQueryValue = urlParams.get(queryParamKey);

        // Initially hide all configured filter elements found in cache
        for (const key in filterElementsCache) {
            if (filterElementsCache.hasOwnProperty(key)) {
                hideElement(filterElementsCache[key]);
            }
        }

        let activeFilterClass = null;

        for (const rule of categoryRules) {
            let match = false;
            // Check for slug identifier in the path
            if (currentPath.includes(rule.slugIdentifier)) {
                match = true;
                // console.log(`Path match for: ${rule.slugIdentifier}`);
            }
            // Check for query parameter match
            if (productCatQueryValue && productCatQueryValue === rule.queryParamValue) {
                match = true;
                // console.log(`Query param match for: ${queryParamKey}=${rule.queryParamValue}`);
            }

            if (match) {
                activeFilterClass = rule.filterClass;
                break; // Found the relevant category, no need to check further
            }
        }

        if (activeFilterClass && filterElementsCache[activeFilterClass]) {
            showElement(filterElementsCache[activeFilterClass]);
            // console.log(`Showing filter: ${activeFilterClass}`);
        } else {
            // console.log("No specific category identifier for benefits filters. All relevant filters remain hidden.");
        }
    }

    // --- Event Listeners & History API Patching ---

    // Run on initial page load
    document.addEventListener('DOMContentLoaded', function() {
        // Initial query and visibility update
        queryFilterElements();
        updateFilterVisibility();

        // Event listener for the specific filter toggle/open button
        const filterToggleButton = document.querySelector(filterToggleButtonSelector);
        if (filterToggleButton) {
            filterToggleButton.addEventListener('click', function() {
                // console.log('Filter toggle button clicked. Re-checking filter visibility.');
                // Optional: Add a small delay if the click action itself takes time to update the DOM or URL
                // setTimeout(updateFilterVisibility, 100); // e.g., 100ms delay
                updateFilterVisibility(); // Call directly for immediate check
            });
        } else {
            // console.warn(`Filter toggle button ("${filterToggleButtonSelector}") not found on DOMContentLoaded.`);
        }
    });

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', function() {
        // console.log('popstate event detected.');
        updateFilterVisibility();
    });

    // Monkey-patch history.pushState and history.replaceState
    const originalPushState = history.pushState;
    history.pushState = function() {
        const result = originalPushState.apply(this, arguments);
        // console.log('history.pushState called.');
        window.dispatchEvent(new Event('pushstate')); // Dispatch custom event
        // updateFilterVisibility(); // Alternative: call directly
        return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        const result = originalReplaceState.apply(this, arguments);
        // console.log('history.replaceState called.');
        window.dispatchEvent(new Event('replacestate')); // Dispatch custom event
        // updateFilterVisibility(); // Alternative: call directly
        return result;
    };

    // Listen to our custom events triggered by patched history methods
    window.addEventListener('pushstate', function() {
        // console.log('Custom pushstate event detected.');
        updateFilterVisibility();
    });
    window.addEventListener('replacestate', function() {
        // console.log('Custom replacestate event detected.');
        updateFilterVisibility();
    });

    // --- WooCommerce Specific AJAX Event (Optional but Recommended) ---
    if (typeof jQuery !== 'undefined') { // Check if jQuery is loaded
        jQuery(document.body).on('updated_wc_div', function() {
            // console.log('jQuery: updated_wc_div detected by WooCommerce.');
            updateFilterVisibility();
        });
        // You can add other jQuery-based plugin-specific events here if needed
        // e.g., jQuery(document.body).on('some_other_plugin_ajax_complete', updateFilterVisibility);
    } else {
        // console.log("jQuery not detected. WooCommerce 'updated_wc_div' event listener not attached via jQuery.");
    }

    // console.log("Benefit filter visibility script initialized and listening for changes.");

})(); // End of IIFE
