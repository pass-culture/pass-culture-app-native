import {
  parsePhoneNumberFromString,
  CountryCode,
  getCountries,
  validatePhoneNumberLength,
} from 'libphonenumber-js'
import * as yup from 'yup'

import { findCountry } from 'features/identityCheck/pages/phoneValidation/helpers/findCountry'

export const phoneNumberSchema = yup.object({
  phoneNumber: yup
    .string()
    .required('Le numéro de téléphone est requis')
    .test('is-valid-phone', '', (phoneNumber, { parent, createError }) => {
      const noPhoneNumber = !phoneNumber
      if (noPhoneNumber) return false

      const noCountry = !findCountry(parent.countryId)
      if (noCountry) return false

      const invalidCountry = !isCountryCode(parent.countryId)
      if (invalidCountry) return false

      const phoneNumberLength = validatePhoneNumberLength(phoneNumber, parent.countryId)
      if (phoneNumberLength === 'TOO_SHORT') return false
      if (phoneNumberLength === 'TOO_LONG') {
        return createError({ message: 'Le numéro de téléphone est trop long' })
      }

      const parsePhoneNumber = parsePhoneNumberFromString(phoneNumber, parent.countryId)
      const phoneNumberInvalid = !parsePhoneNumber?.isValid()
      if (phoneNumberInvalid) {
        return createError({ message: 'Le numéro de téléphone est invalide' })
      }

      return true
    }),
  countryId: yup.string().required(),
})

function isCountryCode(code: string): code is CountryCode {
  const countries: string[] = getCountries()
  return countries.includes(code)
}

export type PhoneNumberFormValues = yup.InferType<typeof phoneNumberSchema>
