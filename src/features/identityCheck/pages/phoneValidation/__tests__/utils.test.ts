import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/utils'

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
