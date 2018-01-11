# congress-vote-stats Backend

A [Serverless](https://serverless.com/framework/) backend for this app. It's an AWS Lambda function written for Node 6.x.

It's essentially just a proxy for one ProPublica Congress API endpoint; it only exists so that I don't have to expose my API key to the client.

To get it up and running:

1. `npm install -g serverless`
2. Authenticate Serverless with your AWS credentials, as seen here: https://serverless.com/framework/docs/providers/aws/guide/credentials/ (since this is just a Lambda function, it'll work fine on the Free Tier)
3. `yarn install` (or you can use npm)
4. Get a [ProPublica Congress API Key](https://www.propublica.org/datastore/api/propublica-congress-api)
5. Create a `env.yml` file with the following contents: `propublicaApiKey: yourApiKey` (substituting the API key you got in the previous step)
6. Run `serverless deploy`
7. Note the URL it deploys to; if you want to run the frontend you'll need to configure it with this URL.
