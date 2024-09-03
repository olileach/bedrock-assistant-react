// MIT License

// Copyright (c) 2024 Oli Leach

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const { StartTranscriptionJobCommand,
  TranscribeClient,
  GetTranscriptionJobCommand,
  DeleteTranscriptionJobCommand } = require('@aws-sdk/client-transcribe');
const uuid = require('uuid');
const variables = require("./variables.js");
// const { response } = require('express');
let client;

// Sleeep function for retry purposes
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Transcribe client
async function transcribeClient() {

  if (variables.environment == "dev") {
    var creds = {
      accessKeyId: variables.accessKey,
      secretAccessKey: variables.secretAccessKey,
    }
  }

  try {
    client = new TranscribeClient({
      region: variables.region,
      credentials: creds
    });
    return client
  } catch (error) {
    console.log(error)
  }
}

// Delete a transcribe job
async function deleteJob(payload) {

  let jobName = payload['jobName'];

  const params = {
    TranscriptionJobName: jobName, // Required. For example, 'transciption_demo'
  };

  try {
    const data = await client.send(
      new DeleteTranscriptionJobCommand(params)
    );
    console.log("Success - deleted job " + this.jobName);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
}


// Transcribe a job and return results
async function startTranscribeJob(params) {

  console.log("Starting Transcribe job.");

  client = await transcribeClient();

  const data = await client.send(new StartTranscriptionJobCommand(params));
  console.log("Success. Transcription job started. Getting Job ID and results.");
  return data.TranscriptionJob.TranscriptionJobStatus;
};

// Check on Transcription job results status
async function transcribeJobResultChecker(params) {

  let jobinprogress = false;

  try{
    while (true) {

      const jobData = await client.send(new GetTranscriptionJobCommand(params));
      const jobStatus = jobData.TranscriptionJob.TranscriptionJobStatus;
      const jobId = jobData.TranscriptionJob.TranscriptionJobName;
      var jobStatusCount = 0;

      if (jobStatus === "COMPLETED") {
        console.log("Job is " + jobStatus + ". Getting transcribe URL.");
        console.log("Transcribe URL:", jobData.TranscriptionJob.Transcript.TranscriptFileUri);

        await fetch(jobData.TranscriptionJob.Transcript.TranscriptFileUri)
          .then(async (response) => response.text())
          .then(async (body) => {
            var response = JSON.parse(body);
            console.log("Job result: " + response.status);
            console.log("Job name: " + response.jobName);
            responseObj = {
              "jobTextResult": response.results.transcripts[0].transcript,
              "jobName": params['TranscriptionJobName'],
              "transcribeFailed": false
            };
          }
          );
        return responseObj;
      }

      else if (jobStatus === "FAILED") {
        console.log("Failed here:", jobData.TranscriptionJob.FailureReason);
        return ({'jobTextResult' : jobData.TranscriptionJob.FailureReason, 'transcribeFailed': true})
      }

      else {
        if (!jobinprogress) {
          console.log("Transcribe job " + jobId + " is " + jobStatus + ". Checking on job status. Will report back once job has completed.");
          jobinprogress = true;
        }
        await sleep(2000);
        jobStatusCount += 1
        if (jobStatusCount % 5 == 0) {
          console.log("Transcribe job " + jobId + " is still " + jobStatus + " and the job has not completed. Will report back once job has completed.");
        }
      }
    }
  } 
  catch (err) {
    console.log("Error", err);
    jobStatusResult = err;
  }
}

async function transcribeJob(payload) {

  var s3key = payload['s3key'];
  var s3endpoint = payload['s3endpoint'];
  var s3ObjectUrl = "https://" + s3endpoint + "/" + s3key;

  const keyUuid = uuid.v4()
  var transcriptionJob = "job-" + keyUuid

  let params = {
    TranscriptionJobName: transcriptionJob,
    LanguageCode: "en-GB",
    MediaFormat: "ogg",
    Media: {
      MediaFileUri: s3ObjectUrl,
    },
  };

  try {
    client = await transcribeClient();

    await startTranscribeJob(params);
    const jobResultsChecker = await transcribeJobResultChecker(params);
    console.log("Transcription Job results output: " + JSON.stringify(jobResultsChecker))
    return jobResultsChecker;

  } catch (err) {
    console.log(err)
  }
}


module.exports = { transcribeJob, deleteJob };