import * as yup from 'yup';

export const configSchema = yup
  .object({
    investCurrencyCode: yup.string().length(3).required(),
    titles: yup
      .array(
        yup.object({
          name: yup.string().required(),
          productId: yup.string().required(),
          size: yup.number().integer().min(0),
        })
      )
      .required(),
  })
  .required();
