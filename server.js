/* Empty js object to act as the app API endpoint, which the data will be stored in when i make a Post request*/
const projectData = {};

/* Express to run server and routes */
// Includes package 'express' in the code, after i have installed it with NPM from my terminal.
const express = require('express');

/* Startup an instance of my app */
const app = express();

/* Dependencies */
// Requires Body-parser to handle the Post request through parsing the data i'm passing through routes on my server.
const bodyParser = require('body-parser');

/* Middleware */
// Configures express to use body-parser as middle-ware by using the .use() method to connect package 'Body-parser' i have installed with NPM from my terminal.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// Cors to let the browser and server talk to each other without any security interruptions.(i.e the server can talk to other ports not just my port :1990)
const cors = require('cors');
app.use(cors());

/* Initializing the main project folder */
// Connect the server-side code to the client-side code
app.use(express.static('ITI Community'));

/* Setup server */
const port = 3000;
const listeningMsg = () => {
    // In my terminal, console.log(server);
    console.log(`server is running on localhost: ${port}`);
}; 
// Utilize the .listen() method
const server = app.listen(port, listeningMsg);

/* Routes */
//Post Route to respond to the (app.js)'s Post Request and store the recieved data from API to the server in the app's endpoint 'projectData object'
const addData = (request, response) => {
    projectData.date = request.body.newDate;
    projectData.temp = request.body.temprature;
    projectData.program = request.body.userProgram;
    projectData.city = request.body.city;
    projectData.description = request.body.description;
    projectData.TimeZone = request.body.TimeZone;
    projectData.newID = request.body.newID;
    // In my terminal, console log the recieved data so i can see it.
    console.log(projectData);
    
};
app.post('/addData', addData);

//Get Route to respond to the browser's request by sending the stored data in the server (in projectData object) */
const sendData = (request, response) => {
    // i just wanted to console log the request parameter in my terminal but yes, it returned a long list of info as explained in the tut.
    // console.log(request)
    //responses with the (pojectData) object when a Get request is made to the server
    response.send(projectData);
};
app.get('/all', sendData);





    
    
    
    
























