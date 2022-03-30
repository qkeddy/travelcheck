// Find global HTML elements on page


/**
 * TODO - Convert this to a click button operation
 * Function to add a country to the countryStats local storage
 */
function addCountry(countryIso2) {
    // Fetch existing counties and store in a local object
    countryStats = JSON.parse(localStorage.getItem("countryStats"));

    // If countryStats is empty then initialize
    if (!countryStats) {
        countryStats = [];
    }

    // Check to see if the country is already stored. If not, add the country to the list.
    countryExists = false;

    for (let i = 0; i < countryStats.length; i++) {
        if (countryStats[i].iso2 === countryIso2) {
            // Country exists in local storage
            countryExists = true;
        }
    }

    // If the country does not exist then push on to the array
    if (!countryExists) {
        let countryStat = {
            name: "",
            iso2: countryIso2,
            flag: "",
            selected: false,
            covidTs: [], // A rolling list of 30 numbers for historical purposes
            todayCases: [], // A rolling list of 30 numbers for historical purposes
            totalCases: [], // A rolling list of 30 numbers for historical purposes
            totalCasesPerMillion: [],
            travelTs: [], // A rolling list of 30 numbers for historical purposes
            travelScore: [], // A rolling list of 30 numbers for historical purposes
        };

        countryStats.push(countryStat);
    }

    // Stringify and write data to local storage
    localStorage.setItem("countryStats", JSON.stringify(countryStats));
}

/**
 * ! COVID-19 data query
 * << Carol to build out and document >>
 */

function refreshCovidData(countryStat) {
    var casesUrl = "https://disease.sh/v3/covid-19/countries";

    console.log("here");

    fetch(casesUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            for (i = 0; i < countryStat.length; i++) {
                for (j = 0; j < data.length; j++) {
                    if (countryStat[i].iso2 == data[j].countryInfo.iso2) {
                        if ((countryStat.flag = "")) {
                            countryStat[i].flag = data[j].countryInfo.flag;
                        }
                        countryStat[i].covidTs.unshift(data[j].updated);
                        countryStat[i].todayCases.unshift(data[j].todayCases);
                        countryStat[i].totalCases.unshift(data[j].cases);
                        countryStat[i].totalCasesPerMillion.unshift(
                            data[j].casesPerOneMillion
                        );
                    }
                }
            }
        });
    return countryStat;
}

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
        countryList.push(countryCode);
    }

    // Stringify and write data to local storage
    localStorage.setItem("countryList", JSON.stringify(countryList));
}

/**
 * ! Update page
 * << Update page with blended data >>
 */
function updatePage() {}

/**
 *  ! Read local storage
 * Reads from local storage and updates the countryData object that can be used by other functions
 */
function readLocalStorage() {
    // Fetch data from local storage and save in local variable
    storedData = JSON.parse(localStorage.getItem("countryStats"));

    return storedData;
}

/**
 * ! Update local storage
 * Writes to local storage from the countryData object
 */
function writeLocalStorage(countryStats) {
    // Write to local storage
    localStorage.setItem("countryStats", JSON.stringify(countryStats));
}

/**
 * ! Initialization function
 */
function init() {

    // TODO - temporary - add a country to countryStats in local storage
    addCountry("US");

    // Fetch latest travel safety data and save to local storage
    // Comment out when testing
    // refreshTravelSafetyData();

    // Read local storage data
    //countryStats = readLocalStorage();

    // If countryStats is empty then initialize the array
    // if (!countryStats) {
    //     countryStats = [];
    // }

    // console.log("Country Stats: ", countryStats);

    // Pull the latest COVID 19 data
    //countryStats = refreshCovidData(countryStats);

    // Pull the latest travel safety data
    //refreshTravelSafetyData();

    // Combine COVID-19 data with travel safety data
    //parseTravelData(country);

    // Write local storage data
    //writeLocalStorage(countryStats);

    // Update the page
    //updatePage();
}

// Run init routine
init();
