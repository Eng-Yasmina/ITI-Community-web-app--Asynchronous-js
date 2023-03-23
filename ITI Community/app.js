/**
 * --IMPORTANT--
 * Steps of how I have developed this web app:
 *  1) I set up the server and route data through my app (check out server.js file).
 *  2) I sent (GET request) to Open Weather Map to recieve the weather data by integrating it's API into my app and fetching the data using [ID converted to zip] and my [API key].
 *  3) I sent (POST request) to the server to store the recieved data in my app's backend (server.js).
 *  4) I sent (GET request) to the server to retrieve the stored data from the server and dynamically update the UI of my app.
 */

/**
 *  Define Global Variables
 */
// Personal API Key for OpenWeatherMap
const apiKey = '7a20be7a7a336e9b7c983861c7ffdec3&units=imperial' 
// Creating a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();
let newID = '';
// Create variables for generate buttons
const generate = document.getElementById('generate');
const goBackBtn = document.getElementById('goBack');

/**
 * End Global Variables
 * Starts Helper Functions
 * IMPORTANT: in my app.js file, helper fns means the generation fns which hold IDs
 */

/**
 * @description creates generation fn that hold the ID  entered by the user.
 */
const generateAction = () => {
    // newID and userProgram are local variables because i want to store them just after the user hit generate
    newID = document.getElementById('ID').value;
    main();
}

/**
 * End Helper Functions
 * Begins Main Functions
 */

/**
 * @description Implement async calling by the use of promise chaining where i pass the mix of API and user responses, to POST endpoint on server side
 */
const main = () => {
    const userProgram = document.getElementById('program').value;
    // Create a dynamic URL for a web api which is a mix of api ,user response and my unique API key to query API database
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
    
    /* POST request to store all the data i recieved locally in my app */
    //Implement async calling by the use of promise chaining
    getWeather(baseUrl, newID, apiKey).then((recievedData) => {
        console.log(recievedData);
        //I noticed that when i pass a wrong ID , it returns (recievedData) object with prop (.cod = 404), in the console. So i used it as a condition to resolve or reject to excute the task.
        if (recievedData.cod != 404) {
            const temprature = recievedData.main.temp;
            const city = recievedData.name;
            const description = recievedData.weather[0].description;
            // To use it displaying the current local time in each city
            const TimeZone = recievedData.timezone;
            // the post function will wait for the data it needs and then will execute
            postData('/addData', { newDate, temprature, city, description, userProgram, TimeZone, newID })
                .then(retrieveData())
                .then(toggleinput());
            
        } else {
            // desplays error msg if the user entered an invalid ID 
            const Error = document.getElementById('Error');
            Error.style.display = 'block';
            setTimeout(()=>{Error.style.display = 'none';},2000);
        }
    })
} 

/**
 * @description asynchronous function to fetch the data the weather Web API.
 */
const getWeather = async (baseurl, userID, apikey) => {
    // [fetch call]: Get request using fetch to the weather web API
    const request = await fetch(`${baseurl}${userID}&appid=${apikey}`);
    try{
        // transform into JSON
        const recievedData = await request.json();
        return(recievedData);
    } catch(error) {
        console.log('error', error);
    }
}

/**
 * @description asychronous function to POST data.
 */
//Request from the client side  to execute the POST route
const postData = async ( url = '', data = {})=>{
    console.log(data);
    //Setup POST route
    const response = await fetch(url, {
        //Setup the type of request
        method:'POST',
        credentials:'same-origin',
        //Setup the type of data
        headers: {
            'Content-Type':'application/json'
        },
        // turn the js object passed in the (data) parameter into a string for my server to receive the info because when sending data to a web server, the data has to be a string.
        body: JSON.stringify(data),
    });
    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch(error) {
        console.log("error", error);
    }
}

/* Dynamically update the UI of my app.*/
//Get request from the client side  to retrieve the stored data from the server.
/**
 * @description asynchronous function to fetch the data from the app endpoint.
 */
const retrieveData = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        // Write updated data to DOM elements
        document.getElementById('temp').innerHTML = `${Math.round((allData.temp- 32) * 5 / 9)}<img style="transform: translateY(-150px); mix-blend-mode: hard-light;" src="images/external-celsius-weather-dreamstale-lineal-dreamstale.png"/>`;
        document.getElementById('content').innerHTML = allData.program;
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('city').innerHTML = `${allData.city}<img src="https://img.icons8.com/material-rounded/30/FFFFFF/marker.png"/>`;
        document.getElementById('description').innerHTML = allData.description;
        // [New feature]: display an updated sample icon for each weather state
        switch (allData.description) {
            case 'few clouds':
                document.getElementById('sample').innerHTML = `<img src="https://img.icons8.com/fluency/96/000000/light-rain-2.png"/>`;
                break;
            case 'clear sky':
                document.getElementById('sample').innerHTML = `<img src="https://img.icons8.com/fluency/96/000000/partly-cloudy-day.png"/>`;
                break;
            case 'overcast clouds':
                document.getElementById('sample').innerHTML = `<img src="https://img.icons8.com/fluency/96/000000/chance-of-storm.png"/>`;
                break;
            case 'moderate rain':
                document.getElementById('sample').innerHTML = `<img src="https://img.icons8.com/fluency/96/000000/moderate-rain.png"/>`;
                break;         
            case 'light rain':
                document.getElementById('sample').innerHTML = `<img src="https://img.icons8.com/fluency/96/000000/light-rain.png"/>`;
                break;         
            case 'heavy rain':
                document.getElementById('sample').innerHTML = `<img src="https://img.icons8.com/fluency/96/000000/storm-with-heavy-rain.png"/>`;
                break;         
            case 'sunny':
                document.getElementById('sample').innerHTML = `<img src="https://img.icons8.com/fluency/96/000000/sun.png"/>`;
                break;         
            default:
                document.getElementById('sample').innerHTML = `<img src="https://img.icons8.com/fluency/96/000000/partly-cloudy-rain.png"/>`
            }
        // [New feature]: display the current local time in each city using its time zone value.
        const printTime = () => {
            const de = new Date();
            let newTime = '';
            switch (allData.TimeZone) {
                case -14400:
                    newTime = de.toLocaleTimeString('en-US', { timeZone: 'America/New_York' });
                    break;
                case -25200:
                    newTime = de.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' });
                    break;
                default:
                    newTime = de.toLocaleTimeString('en-US', { timeZone: 'America/New_York' });
                }
                document.getElementById('digital-clock').innerHTML = newTime;
            }
            printTime();
            setInterval(printTime, 1000);
        // [New feature]: display a background image for each city.
        const toggleBg = () => {
            switch (allData.newID) {
                case '10001':
                case  10001 :
                case '10002':        
                case '10003':        
                case '10005':        
                case '10009':
                case '10010':           
                case '10028':        
                case '10028':        
                case '11101':        
                case '10259':
                    document.body.classList.add('body-1');
                    break;
                case '56273':        
                case '06351':        
                case '06365':
                    document.body.classList.add('body-2');
                    break;
                case '94040':        
                case '90001':        
                case '90002':        
                case '90003':        
                case '90004':        
                case '90005':        
                case '90006':
                case '90009':
                case  90009 :
                case '90089':
                    document.body.classList.add('body-3');
                    break;
                default:
                    document.body.classList.add('body-4');
                    break;
                }
            }
            toggleBg();
        }
        catch(error) {
            console.log('error', error);
            // appropriately handle the error
        }
    }

const refreshPage = () => {
    window.location.reload()
}

//remove the input box to display the entry holder in the whole screen
const toggleinput = () => {
    document.getElementById('app-input-data').style.display = 'none';
    //add option to go back to the input box for a new ID 
    goBackBtn.style.display = 'block';
    document.getElementById('intro').style.display = 'none';
    document.querySelector('.logo').style.display = 'none';
}

/**
 * End Main Functions
 * Begins Events
 */

// TODO: add event listener (generateAction) when clicking on generate button
 generate.addEventListener('click', generateAction);

 // TOO: refresh the page when the user click on go Back button
 goBackBtn.addEventListener('click', refreshPage);















