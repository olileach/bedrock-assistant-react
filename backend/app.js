// loading libraries
const express = require('express');
const s3Utils = require("./libs/s3Utils.js");
const transcribeUtils = require("./libs/transcribeUtils.js");
const bedrockUtils = require("./libs/bedrockUtils.js");
const variables = require("./libs/variables.js");

// configure express
const path = __dirname + '/';
const app = express();

// app configuration
app.use(express.static(path));
const cors = require('cors')

const corsOrigin = process.env.REACT_APP_BASE_URL === undefined ? "http://localhost:3000" : process.env.REACT_APP_BASE_URL


// CORS config
app.use(cors(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", corsOrigin);
  res.header("Access-Control-Allow-Methods: GET, POST, OPTIONS, HEAD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-model-name");
  next();
});

// express header config
app.use(
  express.raw({
    inflate: true,
    limit: '2000mb',
    type: () => true, // this matches all content types
  })
);

// express API routes
app.post('/api/architecture', async function (req, res){
  // encoded has the base64 of your file
  var modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';
  const bedrockSummary = await bedrockUtils.invokeModel(req.body, modelId, "IMAGE");

  if (bedrockSummary.stack) {
    res.send("We've hit this error message - try another model, e.g. anthropic.claude-v2 \n\n" 
    + bedrockSummary.message )
  }
  else { 
    res.send(bedrockSummary);
  };
});


app.post('/api/question', async function (req, res) {

  var modelId = req.headers['x-model-name'];
  var questionInput = (req.body.toString());
  console.log("Using the following modelId: " + modelId);
  console.log("Got the following question: " +questionInput);
  
  if (!questionInput){
    res.send("I didn't get any text to summarise. Did you enter anything? Perhaps, try that again.");
  }

  const bedrockSummary = await bedrockUtils.invokeModel(questionInput, modelId);
  console.log("Value returned by Bedrock: " + bedrockSummary)

  if (bedrockSummary.stack) {
    res.send("We've hit this error message - try another model, e.g. anthropic.claude-v2 \n\n" 
    + bedrockSummary.message )
  }
  else { 
    res.send(bedrockSummary);
  };
});


app.get('/api/models', async function(req,res){
  res.set('Access-Control-Allow-Origin', '*');
  const models = await bedrockUtils.listModels();
  res.send(models);
});

app.post('/api/bedrock', async function (req, res) {

  var modelId = req.headers['x-model-name'];
  var bedrockInput = (req.body.toString());
  console.log("Using the following modelId: " + modelId);
  console.log("Got the following question: " + bedrockInput);

  try {

    const bedrockSummary = await bedrockUtils.invokeModel(bedrockInput, req.headers['x-model-name'])

    // check if transcribeText is not empty otherwise return a message
    if (bedrockSummary.name == "AccessDeniedException") {
      console.log("Model access is denied by Bedrock: " + bedrockSummary.name + " " + bedrockSummary.message);
      res.send
        ("AccessDeniedException: You don't have access to the model with the specified model ID. "+
        "Speak to the website developer or try another model, e.g. anthropic.claude-v2.")
    } else if (bedrockSummary.stack) {
      console.log("Bedrock Stacktrace hit : " + bedrockSummary.stack)
      res.send("We've hit this error message - try another model, e.g. anthropic.claude-v2 \n\n" 
      + bedrockSummary.message )
    } else {
      // send response back - response has been already logged in bedrockUtils.js. 
      res.send(bedrockSummary) 
    }
  }

  catch(err) {
    res.send("Oops - something went wrong. Try that again.");
  }

});

app.post('/api/transcribe', express.raw({type: "*/*", limit: '2000mb'}), async function (req, res) {

  var modelId = req.headers['x-model-name'];
  // console.log("Using the following modelId: " + modelId);
  console.log("Headers: " + JSON.stringify(req.headers));

  let s3response;
  
  try {
    s3response = await s3Utils.s3upload(req.body);
    const transcribeText = await transcribeUtils.transcribeJob(s3response);

    console.log(transcribeText)
    if (transcribeText['jobTextResult'] === ""){
      transcribeText["transcribeFailed"] = true;
      transcribeText['jobTextResult'] = "I didn't get any text from the recording. Something went wrong or there was no text to transcribe."
    }

    // return the transcribeText response back to the client
    res.send(transcribeText)

    // Clean up s3 objects, tarnscript jobs etc..
    s3Utils.s3deleteObject(s3response);
    transcribeUtils.deleteJob(transcribeText);
    
  }
  catch(err) {
    throw "Error with transscription job. Job Status: " + err
  }
});

// server port & listener config
const port = 9000;

const server = app.listen(port, function () {
  console.log('Voice recorder app listening on port 9000')

  // this is needed if running a docker image locally in a dev env.
  if (process.env.ENV == "dev"){
    variables.environment = "dev"
    variables.accessKey  = process.env.AWS_ACCESS_KEY_ID
    variables.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    console.log("Running in a Dev Environment in Docker.")
  }
});

process.on('SIGTERM', () => {
    process.debug('SIGTERM signal received: closing HTTP server')
    server.close((process) => {
    process.debug('HTTP server closed')
  })
})
