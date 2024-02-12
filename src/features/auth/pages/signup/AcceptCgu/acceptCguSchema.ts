import { bool, object } from 'yup'

export const acceptCGUSchema = object().shape({
  acceptCgu: bool().required().isTrue(),
  acceptDataCharter: bool().required().isTrue(),
  marketingEmailSubscription: bool().required(),
})
