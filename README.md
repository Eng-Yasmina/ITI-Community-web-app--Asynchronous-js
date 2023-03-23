# ITI Community web app
Using the solution of fetch and modern promises, i developed an asynchronous js web app that uses web API and user data to dynamically update the UI for the iti student dashboard.



***Steps of how I have developed this Web app:***
1. I set up the server and route data through my app (check out server.js file).
2. I sent (GET request) to Open Weather Map to receive the weather data by integrating it's API into my app and fetching the data using [student ID converted into zip] and my [API key].
3. I sent (POST request) to the server to store the received data in my app's backend (server.js).
4. I sent (GET request) to the server to retrieve the stored data from the server and dynamically update the UI of my app.
# Scripts
- Install: npm install
- Start server: npm run start
# Usage
- The server will listen on port 3000:
- ID examples: 10001,  90009,  15510
# Demo Preview
![iti-web-app.gif](./ITI%20Community/images/ITI.gif)
# Table of contents
- [Project Title](#iti-community-web-app)
- [Scripts](#scripts)
- [Usage](#usage)
- [Demo Preview](#demo-preview)
- [Table of contents](#table-of-contents)
