// Find global HTML elements on page

// Global variables declaration

/**
 * ! COVID-19 data query
 * << Carol to build out and document >>
 */
function refreshCovidData() {}

/**
 * ! Travel safety data query
 * Function to be called once upon page load to cache data to local storage
 */
function refreshTravelSafetyData() {
    // Generate URL to get country travel safety data
    const apiUrl = "https://www.travel-advisory.info/api";

    // Fetch all country data and cache to local storage (per the APIs request)
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (countryData) {
                localStorage.setItem(
                    "countryData",
                    JSON.stringify(countryData.data)
                );
                // Parse the travel data for usage in app
                //parseTravelData();

                console.log("SUCCESS: Travel safety data successfully fetched");
            });
        } else {
            console.log("FAILURE: Safety data successfully fetched");
        }
    });
}

/**
 * Function to parse the data for a selected country
 * @param {*} countryCode
 * @returns
 */

function parseTravelData(countryCode) {
    // Fetch locally stored country travel data
    const localData = JSON.parse(localStorage.getItem("countryData"));

    // Fill object with country data
    let countryData = {
        iso: localData[countryCode].iso_alpha2,
        name: localData[countryCode].name,
        score: localData[countryCode].advisory.score,
    };

    console.log(countryData);

    return countryData;
}

/**
 *
 * @param {*} countryCode
 */
function saveCountry(countryCode) {
    // Fetch existing cities and store in a local object
    countryList = JSON.parse(localStorage.getItem("countryList"));

    // If countList is empty then initialize
    if (!countryList) {
        countryList = [];
    }

    // Check to see if the country is already stored. If not, add the country to the list.
    countryExists = false;
    let i = 0;
    countryList.forEach((element) => {
        if (element === countryCode) {
            // Country exists in local storage
            countryExists = true;
            i = +1;
        }
    });
    // If the country does not exist then push on to the array
    if (!countryExists) {
        console.log("got here");
        countryList.push(countryCode);
    }

    // Stringify and write data to local storage
    localStorage.setItem("countryList", JSON.stringify(countryList));
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
    // Set selected country
    let country = "US";

    // Get country list
    saveCountry(country);

    // Pull the latest COVID 19 data
    refreshCovidData();

    // Pull the latest travel safety data
    //refreshTravelSafetyData();
    parseTravelData(country);

    // Update the page
    updatePage();
}

// Run init routine
init();
