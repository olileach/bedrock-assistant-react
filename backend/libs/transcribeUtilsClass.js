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
const { response } = require('express');

class Car {
  constructor(jobName) {
    this.keyUuid = uuid.v4()
    this.jobName = payload['jobName'];
    this.transcribeClient = transcribeClient();
    this.s3key = payload['s3key'];
    this.s3endpoint = payload['s3endpoint'];
  }

  transcribeClient() {
    var client = new TranscribeClient({
      region: variables.region,
      credentials: creds
    });
    return client
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async deleteJob() {

    jobName = this.jobName
    client = this.transcribeClient
  
    const params = {
      TranscriptionJobName: this.jobName, // Required. For example, 'transciption_demo'
    };

    try {
      client.send(
        new DeleteTranscriptionJobCommand(params)
      );
      console.log("Success - deleted job " + jobName);
    } 
    catch (err) {
      console.log("Error", err);
    }
  }

  async transcribeJobResultChecker () {

    try {

      const jobData = await this.client.send(new GetTranscriptionJobCommand(params));
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
            // console.log("Job output: " + response.results.transcripts[0].transcript);
            this.responseObj = {
              "jobTextResult": response.results.transcripts[0].transcript,
              "jobName": transcriptionJob
            };
          }
          );
      }

      else if (jobStatus === "FAILED") {
        console.log("Failed:", jobData.TranscriptionJob.FailureReason);
        jobStatusResult = jobStatus;
        return (jobStatusResult)
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
        await transcribeJobResultChecker();
      }
    }
    catch (err) {
      console.log("Error", err);
      jobStatusResult = err;
    }
    return this.responseObj;
  }

  async transcribeJob() {

    console.log("Starting Transcribe job.");
  
    const transcriptionJob = "job-" + keyUuid
    const s3ObjectUrl = "https://" + this.s3endpoint + "/" + this.s3key;
  
    const params = {
      TranscriptionJobName: transcriptionJob,
      LanguageCode: "en-GB",
      MediaFormat: "ogg",
      Media: {
        MediaFileUri: s3ObjectUrl,
      },
    };

    try {
      const data = this.client.send(new StartTranscriptionJobCommand(params))
      console.log("Success. Transcription job started. Getting Job ID and results.");
      return data.TranscriptionJob.TranscriptionJobStatus;
    }
    catch(err)
    {
      console.log("Error getting transcribe job results", err);
    }
    const transcribeJob = async () => {
  
      jobinprogress = false;
      this.responseObj = {};
  
      try {
        const data = await this.client.send(
          new StartTranscriptionJobCommand(params)
        );
        
        
      }
      catch (err) {
        
      }
    };
}


// if (variables.environment == "dev") {
//   var creds = {
//     accessKeyId: variables.accessKey,
//     secretAccessKey: variables.secretAccessKey,
//   }
// }

// Sleeep function for retry purposes


// Transcribe client
// async function transcribeClient() {
//   var client = new TranscribeClient({
//     region: variables.region,
//     credentials: creds
//   });
//   return client
// }

// // Delete a transcribe job
// async function deleteJob(payload) {

//   this.jobName = payload['jobName'];
//   this.client = await transcribeClient();

//   const params = {
//     TranscriptionJobName: this.jobName, // Required. For example, 'transciption_demo'
//   };

//   try {
//     const data = await this.client.send(
//       new DeleteTranscriptionJobCommand(params)
//     );
//     console.log("Success - deleted job " + this.jobName);
//     return data; // For unit tests.
//   } catch (err) {
//     console.log("Error", err);
//   }
// }

// Transcribe a job and wait for the results
async function transcribeJob(payload) {

  console.log("Starting Transcribe job.");

  const keyUuid = uuid.v4()
  var transcriptionJob = "job-" + keyUuid
  var s3key = payload['s3key'];
  var s3endpoint = payload['s3endpoint'];
  var s3ObjectUrl = "https://" + s3endpoint + "/" + s3key;
  this.client = await transcribeClient();

  if (variables.environment == "dev") {
    var creds = {
      accessKeyId: variables.accessKey,
      secretAccessKey: variables.secretAccessKey,
    }
  }

  const params = {
    TranscriptionJobName: transcriptionJob,
    LanguageCode: "en-GB",
    MediaFormat: "ogg",
    Media: {
      MediaFileUri: s3ObjectUrl,
    },
  };

  const transcribeJob = async () => {

    jobinprogress = false;
    this.responseObj = {};

    try {
      const data = await this.client.send(
        new StartTranscriptionJobCommand(params)
      );
      console.log("Success. Transcription job started. Getting Job ID and results.");
      return data.TranscriptionJob.TranscriptionJobStatus;
    }
    catch (err) {
      console.log("Error getting transcribe job results", err);
    }
  };

  const transcribeJobResultChecker = async () => {

    try {

      const jobData = await this.client.send(new GetTranscriptionJobCommand(params));
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
            // console.log("Job output: " + response.results.transcripts[0].transcript);
            this.responseObj = {
              "jobTextResult": response.results.transcripts[0].transcript,
              "jobName": transcriptionJob
            };
          }
          );
      }

      else if (jobStatus === "FAILED") {
        console.log("Failed:", jobData.TranscriptionJob.FailureReason);
        jobStatusResult = jobStatus;
        return (jobStatusResult)
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
        await transcribeJobResultChecker();
      }
    }
    catch (err) {
      console.log("Error", err);
      jobStatusResult = err;
    }
    return this.responseObj;
  }

  let jobResults;
  try {
    jobResults = await transcribeJob()
    // if (jobResults === undefined) { return ("No text was transcribed. Your recording did not work")}
    // else{
      console.log(jobResults + " from next")
      const jobResultsChecker = await transcribeJobResultChecker();
      console.log("Transcription Job results output: " + JSON.stringify(jobResultsChecker))
      return jobResultsChecker;
// }
  } catch (err) {
    console.log(err)
  }

}

module.exports = { transcribeJob, deleteJob };