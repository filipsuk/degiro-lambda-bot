# Degiro auto-buy bot

Automatically buys specified titles on DEGIRO with provided cron schedule.

- Deployed by [Serverless Framework](https://www.serverless.com/)
- Uses AWS Lambda for compute and AWS EventBridge for scheduling
- Should be within AWS free tier (check pricing and limits yourself)

## Configuration

1. Copy `config/autoBuy.ts.example` to `config/autoBuy.ts` and replace values with desired settings.
2. Copy `.env.example` to `.env` and fill in your values.

## Deployment

1. Install dependencies `yarn` or `npm i`
2. Follow [this guide](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) to create AWS account and configure credentials. Use `degiro-lambda-bot` as configuration profile name. E.g. `serverless config credentials --provider aws --key ABCD --secret 12345 --profile degiro-lambda-bot`.
3. `yarn deploy`

## Development

1. Install dependencies `yarn` or `npm i`
2. Start serverless-offline `yarn start` or `npm start`
3. You can invoke the functions by POST requests. For example `POST http://localhost:3002/2015-03-31/functions/degiro-lambda-bot-dev-invest/invocations`
