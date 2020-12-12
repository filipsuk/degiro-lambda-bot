import { DeGiroProducTypes } from 'degiro-api/dist/enums';
import * as yup from 'yup';

export const configSchema = yup
  .object({
    investCurrencyCode: yup.string().length(3).required(),
    titles: yup
      .array(
        yup.object({
          name: yup.string().required(),
          type: yup.number().oneOf(Object.values((DeGiroProducTypes as unknown) as number)),
          size: yup.number().integer().min(0),
        })
      )
      .required(),
  })
  .required();
