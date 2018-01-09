'use strict';
const request = require('request-promise');
const padStart = require('pad-start');
const promiseFns = require('promise-fns');

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

const apiKey = process.env.PROPUBLICA_API_KEY;
if (!apiKey)
  throw new Error(
    'Required environment variable "PROPUBLICA_API_KEY" is missing!'
  );

module.exports.getMonthStats = (event, context, callback) => {
  const { month, year } = event.pathParameters;

  const dataPromise = request
    .get(
      `https://api.propublica.org/congress/v1/both/votes/${year}/${padStart(
        month,
        2,
        '0'
      )}.json`,
      {
        headers: { 'X-API-Key': apiKey },
        json: true,
      }
    )
    .then(data => {
      // ProPublica returns 200 OK with an error status code in the body.
      if (data.status !== 'OK') {
        throw Object.assign(new Error(data.error || 'Could not get votes'), {
          response: data,
        });
      } else {
        return data;
      }
    })
    .then(
      data => ({
        statusCode: 200,
        body: JSON.stringify(data),
      }),
      error => ({
        statusCode: 500,
        body: JSON.stringify(err.response || { message: err.message }),
      })
    );

  promiseFns.toCallback(dataPromise, callback);
};
