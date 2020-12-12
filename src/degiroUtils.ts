import { DeGiroActions, DeGiroMarketOrderTypes, DeGiroProducTypes, DeGiroTimeTypes } from 'degiro-api/dist/enums';
import DeGiro from 'degiro-api';
import { OrderType, SearchProductResultType } from 'degiro-api/dist/types';

export async function createLoggedInDegiroInstance(): Promise<DeGiro> {
  const degiro = new DeGiro();
  await degiro.login();
  return degiro;
}

export async function getProductByName({
  degiroInstance,
  name,
  type,
}: {
  degiroInstance: DeGiro;
  name: string;
  type: DeGiroProducTypes;
}): Promise<SearchProductResultType> {
  const result = await degiroInstance.searchProduct({
    text: name,
    type,
    limit: 2,
  });

  if (result.length === 0) {
    throw new Error(`Product not found "${name}"`);
  }

  if (result.length > 1) {
    throw new Error(`More than one product found with name "${name}"`);
  }

  return result[0];
}

export async function executePermanentMarketOrder({
  degiro,
  productId,
  size,
}: {
  degiro: DeGiro;
  productId: string;
  size: number;
}): Promise<void> {
  const order: OrderType = {
    buySell: DeGiroActions.BUY,
    orderType: DeGiroMarketOrderTypes.MARKET,
    productId,
    size,
    timeType: DeGiroTimeTypes.PERMANENT,
  };
  console.log('Order input', order);

  const { confirmationId, freeSpaceNew, transactionFees } = await degiro.createOrder(order);
  console.log('Order created', JSON.stringify({ confirmationId, freeSpaceNew, transactionFees }));
  const orderId = await degiro.executeOrder(order, confirmationId);
  console.log(`Order executed with id: ${orderId}`);
}

export async function waitSeconds(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}
