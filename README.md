# Degiro auto-buy bot

## Development

1. install dependencies `yarn` or `npm i`
2. start serverless-offline `yarn start` or `npm start`


## Deployment

1. Follow [this guide](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) to create AWS account and configure credentials. Use `degiro-lambda-bot` as configuration profile name. E.g. `serverless config credentials --provider aws --key ABCD --secret 12345 --profile degiro-lambda-bot`.
2. `yarn deploy`
