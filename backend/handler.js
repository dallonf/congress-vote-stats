"use strict";
const axios = require("axios");
const padStart = require("pad-start");
const promiseFns = require("promise-fns");

const apiKey = process.env.PROPUBLICA_API_KEY;
if (!apiKey)
  throw new Error(
    'Required environment variable "PROPUBLICA_API_KEY" is missing!'
  );

module.exports.getMonthStats = (event, context, callback) => {
  const { month, year } = event.pathParameters;
  const headers = { "Access-Control-Allow-Origin": "*" };

  const dataPromise = axios
    .get(
      `https://api.propublica.org/congress/v1/both/votes/${year}/${padStart(
        month,
        2,
        "0"
      )}.json`,
      {
        headers: { "X-API-Key": apiKey },
      }
    )
    .then((response) => {
      const { data } = response;
      // ProPublica returns 200 OK with an error status code in the body.
      if (data.status !== "OK") {
        throw Object.assign(new Error(data.error || "Could not get votes"), {
          response: data,
        });
      } else {
        return data;
      }
    })
    .then(
      (data) => ({
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      }),
      (err) => ({
        statusCode: 500,
        headers,
        body: JSON.stringify(err.response || { message: err.message }),
      })
    );

  promiseFns.toCallback(dataPromise, callback);
};
