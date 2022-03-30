// Find global HTML elements on page


// Global variables declaration


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
function refreshTravelSafetyData() {
    
}



/**
 * ! Update page
 * << Update page with blended data >>
 */
function updatePage() {

}



/**
 * ! Initialization function
 */
function init() {
    // Pull the latest COVID 19 data
    refreshCovidData();

    // Pull the latest travel safety data
    refreshCovidData();

    // Update the page
    updatePage();
}

// Run init routine
init();