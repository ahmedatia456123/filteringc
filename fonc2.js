document.addEventListener('DOMContentLoaded', function() {

    const filterToggleButtonSelector = '.em-button-outline.em-font-semibold.catalog-toolbar__filter-button';
    const filterToggleButton = document.querySelector(filterToggleButtonSelector);

    // Configuration for category identifiers and their corresponding filter classes
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
    ];
    const queryParamKey = "product_cat";

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

    // --- Main logic function that will run on button click ---
    function applyFilterVisibility() {
        console.log("applyFilterVisibility called due to button click.");

        // Get all relevant filter elements based on the config
        // We query these each time in case the DOM changes, or they weren't available before.
        const filterElements = {};
        categoryRules.forEach(rule => {
            const element = document.querySelector('.' + rule.filterClass);
            if (element) {
                filterElements[rule.filterClass] = element;
            } else {
                console.warn(`Filter element with class "${rule.filterClass}" not found when button was clicked.`);
            }
        });

        // Get the current page's path and query string AT THE TIME OF THE CLICK
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const urlParams = new URLSearchParams(currentSearch);
        const productCatQueryValue = urlParams.get(queryParamKey);

        console.log("Current path on click:", currentPath);
        console.log("Current search on click:", currentSearch);
        console.log("Product cat query on click:", productCatQueryValue);


        // Initially hide all configured filter elements before deciding which to show
        // This ensures if the category changed via AJAX before this button click,
        // we reset the state correctly.
        for (const key in filterElements) {
            if (filterElements.hasOwnProperty(key)) {
                hideElement(filterElements[key]);
            }
        }

        // Determine which filter to show
        let activeFilterClass = null;

        for (const rule of categoryRules) {
            let match = false;
            // Check for slug identifier in the path
            if (currentPath.includes(rule.slugIdentifier)) {
                match = true;
                console.log(`Path match for: ${rule.slugIdentifier}`);
            }
            // Check for query parameter match
            if (productCatQueryValue && productCatQueryValue === rule.queryParamValue) {
                match = true;
                console.log(`Query param match for: ${queryParamKey}=${rule.queryParamValue}`);
            }

            if (match) {
                activeFilterClass = rule.filterClass;
                break; // Found the relevant category, no need to check further
            }
        }

        if (activeFilterClass && filterElements[activeFilterClass]) {
            showElement(filterElements[activeFilterClass]);
            console.log(`Showing filter: ${activeFilterClass}`);
        } else {
            console.log("No specific product category identifier (slug or query param) detected for benefits filters based on current URL. All relevant filters remain hidden.");
        }
    }
    // --- End of main logic function ---


    if (filterToggleButton) {
        filterToggleButton.addEventListener('click', applyFilterVisibility);
        console.log(`Event listener attached to button: "${filterToggleButtonSelector}"`);
    } else {
        console.warn(`Button with selector "${filterToggleButtonSelector}" not found. Filter logic will not be triggered by click.`);
    }

});
