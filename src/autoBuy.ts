import type { Handler } from 'aws-lambda';
import 'source-map-support/register';
import Big from 'big.js';

import autoBuyConfig from '../config/autoBuy';
import { configSchema } from '../config/schemas';

import {
  createLoggedInDegiroInstance,
  executePermanentMarketOrder,
  getProductByName,
  waitSeconds,
} from './degiroUtils';

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

  for (const title of config.titles.filter((value) => value.size > 0)) {
    try {
      // Avoid rate-limiting api errors
      await waitSeconds(1);
      const product = await getProductByName({ degiroInstance: degiro, name: title.name, type: title.type });
      console.log(`Buying "${product.name}"...`);

      if (product.currency !== config.investCurrencyCode) {
        throw new Error(
          `Product currency (${product.currency}) does not match your config currency. Investing in multiple currencies not implemented yet :/`
        );
      }

      const buyMarketValue = Big(product.closePrice).mul(title.size);
      if (buyMarketValue.gt(fundsLeft)) {
        throw new Error(`Not enough funds left for buying ${title.size} x ${product.name}`);
      }

      await executePermanentMarketOrder({ degiro, productId: product.id, size: title.size });

      fundsLeft -= Number(buyMarketValue);
      console.log(`Approx. funds left: ${fundsLeft}`);
    } catch (err) {
      console.error(`Error while buying "${title.name}"`, err);
    }
  }

  await degiro.logout();
  console.log('Done!');
};
