# Bedrock Summariser

This is a simple web app built on Node.js and React that allows you to summarise a conversation, ask a question, or upload an AWS Architecture diagram to get a summary, using your web browser and your browser microphone for recording a conversation. It leverages AWS Bedrock and allows you to try out different Bedrock Foudnational Models. 


## Description

This app best runs in Chrome but can also run in Firefox (Chrome doesn't impact chime or zoom microphone inputs). It's a client server app using Node.js Express as middleware. Front end is React, so HTML and Javascript. Back end uses Amazon Bedrock and Amazon Transcribe to convert the voice recording to text and Amazon Bedrock to summarise the recording or directly integrated with the Bedrock models for a direct answer.

# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available scripts to launch the app locally

### `npm install`

You will need NPM installed and to run the following to install all the modules in package.json. Do this in both frontend and backend, as react and express use different modules.

So, from the root of the project, run:

```
cd frontend
npm install --legacy-peer-deps
cd ../backend 
npm install --legacy-peer-deps
```

### `npm start dev`

In the frontend project directory, you can run ```npm start dev```. This will start the react app on port 3000 and the express app on port 9000. The express app.js runs the backend API whilst the frontend app runs the webpage users will connect to.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

So, from the root of the project, run:

```
cd frontend
npm start dev
```

## Production build

This section is incomplete but you can deploy a production build for the frontend and backend. The frontend build creates a react build folder used to serve up the static page. The backend just runs node express.js, so you need to install the npm modules.

For the front end build, you can run:

```
cd frontend
npm run build:uat
cd ../backend 
npm run build:uat
```

Use the Dockerfiles in the frontend and backend folders to create docker images for both services. Note: Way more work to do on this section.

## UI tools

The project uses MUI - [https://mui.com/](https://mui.com/). Other modules that are not used in this project are listed in the package.json due to trialing out other NPM packages. It'll need a clean up at some point.

Project is still very much work in progress.

## To do

 - Give the user the ability to ask a question based on the existing conversation summary
 - Stream the voice recording rather than saving it, uploading it and sending it to Bedrock
 - Add Amazon Q for Business so you can ask questions against content in S3, or external websites.
 - Some form of Identity Center authentication
 - A deployment pipeline for new builds
 - ... and more.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)


