import { CountryCode } from 'libphonenumber-js'

import {
  formatPhoneNumberForDisplay,
  formatPhoneNumberWithPrefix,
} from 'features/identityCheck/pages/phoneValidation/utils'

describe('formatPhoneNumberWithPrefix', () => {
  it.each`
    providedNumber          | providedCallingCode | expectedOutput
    ${'06.33.34.45.54'}     | ${'33'}             | ${'+33633344554'}
    ${'0633344554'}         | ${'33'}             | ${'+33633344554'}
    ${'6.33.34.45.54'}      | ${'33'}             | ${'+33633344554'}
    ${'633344554'}          | ${'33'}             | ${'+33633344554'}
    ${'6-33-34-45-54'}      | ${'33'}             | ${'+33633344554'}
    ${'06.33.34.45.54'}     | ${'33'}             | ${'+33633344554'}
    ${'06  33  34  45  54'} | ${'33'}             | ${'+33633344554'}
    ${'446566'}             | ${'687'}            | ${'+687446566'}
  `(
    'formatPhoneNumberWithPrefix($providedNumber, $providedCallingCode) should return $expectedOutput',
    ({
      providedNumber,
      providedCallingCode,
      expectedOutput,
    }: {
      providedNumber: string
      providedCallingCode: string
      expectedOutput: string
    }) => {
      expect(formatPhoneNumberWithPrefix(providedNumber, providedCallingCode)).toEqual(
        expectedOutput
      )
    }
  )
})

describe('formatPhoneNumberForDisplay', () => {
  it.each`
    providedNumber          | providedCountryCode | expectedOutput
    ${'06.33.34.45.54'}     | ${'FR'}             | ${'+33\u00a06\u00a033\u00a034\u00a045\u00a054'}
    ${'0633344554'}         | ${'FR'}             | ${'+33\u00a06\u00a033\u00a034\u00a045\u00a054'}
    ${'6.33.34.45.54'}      | ${'FR'}             | ${'+33\u00a06\u00a033\u00a034\u00a045\u00a054'}
    ${'633344554'}          | ${'FR'}             | ${'+33\u00a06\u00a033\u00a034\u00a045\u00a054'}
    ${'6-33-34-45-54'}      | ${'FR'}             | ${'+33\u00a06\u00a033\u00a034\u00a045\u00a054'}
    ${'06.33.34.45.54'}     | ${'FR'}             | ${'+33\u00a06\u00a033\u00a034\u00a045\u00a054'}
    ${'06  33  34  45  54'} | ${'FR'}             | ${'+33\u00a06\u00a033\u00a034\u00a045\u00a054'}
    ${'446566'}             | ${'NC'}             | ${'+687\u00a044\u00a065\u00a066'}
  `(
    'formatPhoneNumberWithPrefix($providedNumber, $providedCallingCode) should return $expectedOutput',
    ({
      providedNumber,
      providedCountryCode,
      expectedOutput,
    }: {
      providedNumber: string
      providedCountryCode: CountryCode
      expectedOutput: string
    }) => {
      expect(formatPhoneNumberForDisplay(providedNumber, providedCountryCode)).toEqual(
        expectedOutput
      )
    }
  )
})
