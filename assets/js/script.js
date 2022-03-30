// Find global HTML elements on page

// Global variables declaration
  countryStat = {
      name: "",
      iso2: "",
      flag: "",
      selected: false,
      covidTs: [], // A rolling list of 30 numbers for historical purposes
      todayCases: [], // A rolling list of 30 numbers for historical purposes
      totalCases: [], // A rolling list of 30 numbers for historical purposes
      travelTs: [], // A rolling list of 30 numbers for historical purposes
      travelScore: [], // A rolling list of 30 numbers for historical purposes
  };

/**
 * ! COVID-19 data query
 * << Carol to build out and document >>
 */

function refreshCovidData() {
    var casesUrl = 'https://disease.sh/v3/covid-19/countries';

    fetch(casesUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            for (i = 0; i < countryData.length; i++) {
                for (j=0;j<data.length;j++) {
                    if (countryData[i].iso2 == data[j].countryInfo.iso2) {
                        if (countryData.flag = '') {
                            countryData[i].flag = data[j].countryInfo.flag;
                        }
                        countryData[i].covidTs.unshift(data[j].updated)
                        countryData[i].todayCases.unshift(data[j].todayCases);
                        countryData[i].totalCases.unshift(data[j].cases);
                        countryData[i].totalCasesPerMillion.unshift(data[j].casesPerOneMillion);
                    }
                }

            }
        });

}

/**
 * ! Travel safety data query
 * << Quin to build out and document >>
 */
function refreshTravelSafetyData() {}

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
    // Read local storage data
    countryStats = readLocalStorage();

    // TODO - Remove (for testing purposes only)
    if (storedData) {
        for (let i = 0; i < storedData.length; i++) {
            console.log(storedData[i].name);
        }
    } else {
        console.log("No country data is locally available");
    }

    // Pull the latest COVID 19 data
    countryStats = refreshCovidData(countryStats);

    // Pull the latest travel safety data
    countryStats = refreshTravelSafetyData(countryStats);

    //TODO - Remove (for testing purposes only)
   countryStats = [
       {
           name: "United States",
           iso2: "US",
           flag: "https://disease.sh/assets/img/flags/us.png",
           selected: true,
           covidTs: [1648568439677], // A rolling list of 30 numbers for historical purposes
           todayCases: [123], // A rolling list of 30 numbers for historical purposes
           totalCases: [123123], // A rolling list of 30 numbers for historical purposes
           travelTs: [1648568439677], // A rolling list of 30 numbers for historical purposes
           travelScore: [3.5], // A rolling list of 30 numbers for historical purposes
       },
       {
           name: "Albania",
           iso2: "AL",
           flag: "https://disease.sh/assets/img/flags/al.png",
           selected: true,
           covidTs: [1648568439677], // A rolling list of 30 numbers for historical purposes
           todayCases: [123], // A rolling list of 30 numbers for historical purposes
           totalCases: [123123], // A rolling list of 30 numbers for historical purposes
           travelTs: [1648568439677], // A rolling list of 30 numbers for historical purposes
           travelScore: [2.5], // A rolling list of 30 numbers for historical purposes
       },
   ];
    
    // Write local storage data
    writeLocalStorage(countryStats);

    // Update the page
    updatePage();
}

// Run init routine
init();
