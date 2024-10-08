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

const variables = require("./variables.js");
const { BedrockRuntimeClient,
        InvokeModelCommand,
        ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");
const { BedrockClient,
        ListFoundationModelsCommand,} = require("@aws-sdk/client-bedrock");

if (variables.environment == "dev"){
  var creds =  {
    accessKeyId: variables.accessKey,
    secretAccessKey: variables.secretAccessKey,
  }
}

// Create a new Bedrock Runtime client instance.
async function bedrockClient (){
  var client = new BedrockRuntimeClient({ 
    region: variables.bedrockRegion,
    credentials: creds
  });
  return client
}

// Function to invoke a Bedrock Model.
const invokeModel = async (input, modelId = "anthropic.claude-v2:1", inputType="text") => {

  console.log("This is the value of type: " + inputType);
  console.log("This is the model used: " + modelId);
  var imageB64String = Buffer.from(input).toString();

  var client = await bedrockClient();

  if (inputType=='IMAGE'){
    modelId = "anthropic.claude-3-sonnet-20240229-v1:0"
    console.log("Using Amazon mode inputs for " + modelId);
    payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageB64String.replace(/"/g, ''),
              }
            },
            {
              type: "text",
              text: "What is this architecture?"
            },
          ],
        },
      ],
    };
    var command = new InvokeModelCommand({
      contentType: "application/json",
      body: JSON.stringify(payload),
      modelId,
    });

    console.log("Using model " + modelId+ " and payload" + JSON.stringify(payload));
      
    try{

      const apiResponse = await client.send(command);
      console.log(apiResponse.toString());
      const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
      /** @type {MessagesResponseBody} */
      const responseBody = JSON.parse(decodedResponseBody);
      console.log(decodedResponseBody)
      console.log(responseBody.content[0].text);
      return responseBody.content[0].text;
    }
    catch(err){

      console.log(err)
      return err
    }
  } else {
    const conversation = [
      {
        role: "user",
        content: [{ text: input }],
      },
    ];
    
    var command = new ConverseCommand({
      modelId,
      messages: conversation,
      inferenceConfig: { temperature: 0.5, topP: 0.9 },
    });

    console.log("Running Converse command: " + JSON.stringify(command))
    
    try {
      const response = await client.send(command);
      const responseText = response.output.message.content[0].text;
      console.log(responseText);
      return(responseText)
    } catch (err) {
      var msg = `ERROR: Can't invoke ${modelId}. Reason: ${err}`;
      console.log(msg)
      return(msg)
    }
  }
}

async function listModels(outputModality="TEXT") {

  const client = new BedrockClient({
    region: variables.bedrockRegion,
  });
  
  // Configure input to only use TEXT and ON_DEMAND foundational models.
  const input = {
    // byProvider: "Anthropic",
    // byProvider: 'STRING_VALUE',
    // byCustomizationType: 'FINE_TUNING' || 'CONTINUED_PRE_TRAINING',
    byOutputModality: outputModality,
    byInferenceType: 'ON_DEMAND', // || 'PROVISIONED',
  };

  const command = new ListFoundationModelsCommand(input);
  
  const response = await client.send(command);

  var models = [];
  
  for (i in response['modelSummaries']){
    var model = response['modelSummaries'][i]['modelId'];
    if (!models.includes(model)){
      models.push({ 'model': model });
    }
  }

  return(models);
};

module.exports = { invokeModel, listModels };