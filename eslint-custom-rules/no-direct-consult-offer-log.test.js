import { RuleTester } from 'eslint'
import { config } from './config'

import rule from './no-direct-consult-offer-log'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    {
      code: 'triggerConsultOfferLog();',
    },
    {
      code: 'analytics.logConsultVenue();',
    },
  ],
  invalid: [
    {
      code: 'analytics.logConsultOffer();',
      errors: [{ message: 'Use `triggerConsultOfferLog` rather than `analytics.logConsultOffer`' }],
    },
    {
      code: 'analytics.logConsultOffer({ someData: true });',
      errors: [{ message: 'Use `triggerConsultOfferLog` rather than `analytics.logConsultOffer`' }],
    },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) =>
  Object.assign(t, config, {
    errors: [
      {
        message: 'Use `triggerConsultOfferLog` rather than `analytics.logConsultOffer`',
      },
    ],
  })
)

ruleTester.run('no-direct-consult-offer-log', rule, tests)
