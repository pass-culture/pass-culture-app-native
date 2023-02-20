import { isPhoneNumberValid } from 'features/identityCheck/pages/phoneValidation/helpers/isPhoneNumberValid'

describe('isPhoneNumberValid', () => {
  it.each`
    phoneNumber         | isValid
    ${'111111111'}      | ${true}
    ${'0111111111'}     | ${true}
    ${'011111111'}      | ${false}
    ${'1111111'}        | ${false}
    ${'1.11.11.11.11'}  | ${true}
    ${'01.11.11.11.11'} | ${true}
    ${'0-11-11-11-11'}  | ${false}
    ${'1-11-11-11'}     | ${false}
  `('should return $isValid if phone number is $phoneNumber', ({ phoneNumber, isValid }) => {
    const result = isPhoneNumberValid(phoneNumber)
    expect(result).toBe(isValid)
  })
})
