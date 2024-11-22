import { isPhoneNumberValid } from 'features/identityCheck/pages/phoneValidation/helpers/isPhoneNumberValid'

const METROPOLITAN_FRANCE_CALLING_CODE = '33'
const NEW_CALEDONIA_CALLING_CODE = '687'

describe('isPhoneNumberValid', () => {
  it.each`
    phoneNumber         | countryCallingCode                  | isValid
    ${'012345'}         | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'012345'}         | ${NEW_CALEDONIA_CALLING_CODE}       | ${true}
    ${'012-345'}        | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'012-345'}        | ${NEW_CALEDONIA_CALLING_CODE}       | ${true}
    ${'123456'}         | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'123456'}         | ${NEW_CALEDONIA_CALLING_CODE}       | ${true}
    ${'1234567'}        | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'12345678'}       | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'123456789'}      | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${true}
    ${'123-456-789'}    | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${true}
    ${'0123456789'}     | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${true}
    ${'12-34-56'}       | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'12-34-56'}       | ${NEW_CALEDONIA_CALLING_CODE}       | ${true}
    ${'12-34-56-78'}    | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'1-23-45-67-89'}  | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${true}
    ${'01-23-45-67-89'} | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${true}
    ${'12.34.56'}       | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'12.34.56'}       | ${NEW_CALEDONIA_CALLING_CODE}       | ${true}
    ${'12.34.56.78'}    | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'1.23.45.67.89'}  | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${true}
    ${'01.23.45.67.89'} | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${true}
    ${'12345'}          | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'12345678910'}    | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'011111111'}      | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'0-11-11-11-11'}  | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'1-11-11-11'}     | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'+33123456'}      | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
    ${'06+123'}         | ${METROPOLITAN_FRANCE_CALLING_CODE} | ${false}
  `(
    'should return $isValid if phone number is $phoneNumber and countryCallingCode is $countryCallingCode',
    ({ phoneNumber, countryCallingCode, isValid }) => {
      const result = isPhoneNumberValid(phoneNumber, countryCallingCode)

      expect(result).toBe(isValid)
    }
  )
})
