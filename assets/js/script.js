// Find global HTML elements on page

// Global variables declaration


/**
 * ! COVID-19 data query
 * << Carol to build out and document >>
 */
function refreshCovidData() {}

/**
 * ! Travel safety data query
 * << Quin to build out and document >>
 */
function refreshTravelSafetyData() {
    console.log("Travel safety data fetched");
}

/**
 * ! Update page
 * << Update page with blended data >>
 */
function updatePage() {
    console.log("Page updated");
}

/**
 * ! Initialization function
 */
function init() {
    // Pull the latest COVID 19 data
    refreshCovidData();

    // Pull the latest travel safety data
    refreshTravelSafetyData();

    // Update the page
    updatePage();
}

// Run init routine
init();
