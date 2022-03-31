// Find global HTML elements on page
var formEl = document.getElementById('countryList');
var countryNameEl = document.getElementById('countryName');
var flagEl = document.getElementById('flagImage');
var casesPerMilEl = document.getElementById('casesPerMil')
var newCasesEl = document.getElementById('newCases');
var travelScoreEl = document.getElementById('advisoryNum');
var savedCountriesEl = document.getElementById('savedQueries');
submitButtonEl = document.querySelector("button");

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
function updatePage() {
    var newCountry = formEl.value;
    addCountry(newCountry);
    var countryData = readLocalStorage();
    updateCountries(countryData);
    updateData(newCountry);
}

/**
 * ! Update Countries
 * << Update search history with list items >>
 */
function updateCountries(countryData) {
    savedCountriesEl.innerHTML = '';
    for (i = 0; i < countryData.length; i++) {
        var liEl = document.createElement('li');
        liEl.textContent = countryData[i].name;
        liEl.setAttribute('data-iso2', countryData[i].iso2);
        liEl.setAttribute('class', 'mdc-list-item');
        liEl.addEventListener('click', handleClick);
        savedCountriesEl.append(liEl);

    }
}

/**
 * ! Update Data
 * << Update travel score and covid data on page >>
 */
function updateData(iso2) {
    var countryData = readLocalStorage();
    for (i=0; i <countryData.length; i++) {
        if (countryData[i].iso2 == iso2) {
            datef.textContent = moment.unix(day.dt).format('MM-DD-YYYY')
            countryNameEl.textContent = countryData[i].name;
            flagEl.setAttribute('src', countryData[i].flag);
            casesPerMilEl.textContent = countryData[i].totalCasesPerMillion[0];
            newCasesEl.textContent = countryData[i].todayCases[0];
            travelScoreEl.textContent = countryData[i].travelScore[0];
        }
    }
    return;
}

/**
 * ! Handle click
 * << Handle click event listener >>
 */
function handleClick(event) {
    var iso2 = event.target.getAttribute('data-iso2');
    updateData(iso2);
}


function populateList() {

    var casesUrl = "https://disease.sh/v3/covid-19/countries"

    fetch(casesUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.length);
            for (i=0; i < data.length; i++) {
                if (data[i].countryInfo.lat !== 0){ //generate option tag                                   
                    var optionEl = document.createElement("option")
                    //set option value to data[0].countryInfo.iso2          
                    optionEl.value = data[i].countryInfo.iso2
                    //set option text context to data[0].country            
                    optionEl.textContent = data[i].country
                    //append to optgroup where label === data[0].continent  
                    rootEl = document.getElementById(data[i].continent);
                    rootEl.append(optionEl); }
                               
            }
        })
}

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
    // Pull latest travel safety data and update CountryStats
    refreshTravelSafetyData(); // Comment out when testing

    // Pull the latest COVID-19 data and update countryStats
    refreshCovidData();

    // Update the page
    updatePage();

    // Populates country list
    populateList()
}

// Run init routine
init();


// Event listener to select a certain country
submitButtonEl.addEventListener("click", function(event) {
    // Override default HTML form behavior
    event.preventDefault();

    // TODO - temporary - add a country to countryStats in local storage. The hardcoded string will be replaced with the selected country from the dropdown.
    addCountry("AL");

    // Add the travel safety to CountryStats
    addTravelData(); // Comment out when testing

    // Pull the latest COVID-19 data and update countryStats
    refreshCovidData();

    updatePage();
});
