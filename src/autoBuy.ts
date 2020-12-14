import type { Handler } from 'aws-lambda';
import 'source-map-support/register';
import Big from 'big.js';
import { SearchProductResultType } from 'degiro-api/dist/types';

import autoBuyConfig from '../config/autoBuy';
import { configSchema } from '../config/schemas';

import { createLoggedInDegiroInstance, executePermanentMarketOrder, waitSeconds } from './degiroUtils';

export const handler: Handler = async () => {
  const config = configSchema.validateSync(autoBuyConfig);
  const degiro = await createLoggedInDegiroInstance();

  await waitSeconds(2);
  const cashFunds = await degiro.getCashFunds();
  const availableFundsInCurrency = cashFunds.find((value) => value.currencyCode === config.investCurrencyCode);
  if (!availableFundsInCurrency || availableFundsInCurrency.value === 0) {
    throw new Error(`No ${config.investCurrencyCode} funds in this account.`);
  }
  console.log(`Available funds: ${availableFundsInCurrency.value} ${availableFundsInCurrency.currencyCode}`);

  let fundsLeft = availableFundsInCurrency.value;

  const products = ((await degiro.getProductsByIds(config.titles.map((title) => title.productId))) as unknown) as {
    [id: string]: SearchProductResultType;
  };

  for (const product of Object.values(products)) {
    try {
      const titleConfig = config.titles.find((title) => title.productId === product.id);
      if (!titleConfig) {
        throw new Error('Could not match the product from the API to the config productId!');
      }

      if (product.currency !== config.investCurrencyCode) {
        throw new Error(
          `Product currency (${product.currency}) does not match your config currency. Investing in multiple currencies not implemented yet :/`
        );
      }

      const buyMarketValue = Big(product.closePrice).mul(titleConfig.size);
      if (buyMarketValue.gt(fundsLeft)) {
        throw new Error(`Not enough funds left for buying ${titleConfig.size} x ${titleConfig.name}`);
      }

      console.log(`Buying "${product.name}"...`);
      await executePermanentMarketOrder({ degiro, productId: product.id, size: titleConfig.size });

      fundsLeft -= Number(buyMarketValue);
      console.log(`Approx. funds left: ${fundsLeft}`);
    } catch (err) {
      console.error(`Error while buying "${product.name}"`, err);
    }
  }

  await degiro.logout();
  console.log('Done!');
};
