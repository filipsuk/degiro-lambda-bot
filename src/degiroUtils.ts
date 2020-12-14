import { DeGiroActions, DeGiroMarketOrderTypes, DeGiroTimeTypes } from 'degiro-api/dist/enums';
import DeGiro from 'degiro-api';
import { OrderType } from 'degiro-api/dist/types';

export async function createLoggedInDegiroInstance(): Promise<DeGiro> {
  const degiro = new DeGiro();
  await degiro.login();
  return degiro;
}

export async function waitSeconds(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
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
  await waitSeconds(1);
  const { confirmationId, freeSpaceNew, transactionFees } = await degiro.createOrder(order);
  console.log('Order created', JSON.stringify({ confirmationId, freeSpaceNew, transactionFees }));
  await waitSeconds(1);
  const orderId = await degiro.executeOrder(order, confirmationId);
  console.log(`Order executed with id: ${orderId}`);
}
