# Degiro auto-buy bot

## Configuration

1. Copy `config/autoBuy.ts.example` to `config/autoBuy.ts` and replace values with desired settings.
2. Copy `.env.example` to `.env` and fill in your degiro credentials.

## Development

1. Install dependencies `yarn` or `npm i`
2. Start serverless-offline `yarn start` or `npm start`
3. You can invoke the functions by POST requests. For example `POST http://localhost:3002/2015-03-31/functions/degiro-lambda-bot-dev-invest/invocations`

## Deployment

1. Follow [this guide](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) to create AWS account and configure credentials. Use `degiro-lambda-bot` as configuration profile name. E.g. `serverless config credentials --provider aws --key ABCD --secret 12345 --profile degiro-lambda-bot`.
2. `yarn deploy`
