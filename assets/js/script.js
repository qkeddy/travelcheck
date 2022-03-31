// Find global HTML elements on page

/**
 * TODO - Convert this to a click button operation
 * ! Function to add a country to the countryStats local storage
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

    // Write data to local storage
    writeLocalStorage(countryStats);
}

/**
 * ! Fetch COVID-19 data from disease.sh service and update the object countryStats
 */
function refreshCovidData() {
    var casesUrl = "https://disease.sh/v3/covid-19/countries";

    // Read local storage data
    let countryStats = readLocalStorage();

    fetch(casesUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            for (i = 0; i < countryStats.length; i++) {
                for (j = 0; j < data.length; j++) {
                    if (countryStats[i].iso2 == data[j].countryInfo.iso2) {
                        if (countryStats[i].flag === "") {
                            countryStats[i].flag = data[j].countryInfo.flag;
                        }
                        countryStats[i].name = data[j].country;
                        countryStats[i].covidTs.unshift(data[j].updated);
                        countryStats[i].todayCases.unshift(data[j].todayCases);
                        countryStats[i].totalCases.unshift(data[j].cases);
                        countryStats[i].totalCasesPerMillion.unshift(
                            data[j].casesPerOneMillion
                        );
                    }
                }
            }
            // Write results to local storage
            writeLocalStorage(countryStats);
        });
}

/**
 * ! Function to be called once upon page load to cache data to local storage
 */
function refreshTravelSafetyData() {
    // Generate URL to get country travel safety data
    const apiUrl = "https://www.travel-advisory.info/api";

    // Fetch all country data and cache to local storage (per the APIs request)
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (travelData) {
                localStorage.setItem(
                    "travelData",
                    JSON.stringify(travelData.data)
                );
                console.log("SUCCESS: Travel safety data successfully fetched");
                // Layer in the travel safety data with the COVID-19 data
                addTravelData();
            });
        } else {
            console.log("FAILURE: Safety data successfully fetched");
        }
    });
}

/**
 * ! Function to layer in the travel safety data with the COVID-19 data
 */
function addTravelData() {
    // Fetch locally stored country travel data
    let travelData = JSON.parse(localStorage.getItem("travelData"));

    // Read local storage data
    let countryStats = readLocalStorage();

    // Fill object with country data
    for (let i = 0; i < countryStats.length; i++) {
        // Get the ISO2 code
        const countryIso2 = countryStats[i].iso2;

        // Convert to epoch time
        let tempDate =
            new Date(travelData[countryIso2].advisory.updated).valueOf() / 1000;

        // Set the respective values in the object
        countryStats[i].travelTs.unshift(tempDate);
        countryStats[i].travelScore.unshift(
            travelData[countryIso2].advisory.score
        );
    }

    // Write results to local storage
    writeLocalStorage(countryStats);
}

/**
 * ! Update page
 * << Update page with blended data >>
 */
function updatePage() {}

/**
 * ! Reads from local storage and updates the countryData object that can be used by other functions
 */
function readLocalStorage() {
    // Fetch data from local storage and save in local variable
    storedData = JSON.parse(localStorage.getItem("countryStats"));

    return storedData;
}

/**
 * ! Writes to local storage from the countryData object
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

    // Pull latest travel safety data and update CountryStats
    refreshTravelSafetyData(); // Comment out when testing

    // Pull the latest COVID-19 data and update countryStats
    refreshCovidData();

    // Update the page
    updatePage();
}

// Run init routine
init();
