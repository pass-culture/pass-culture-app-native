import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js'

import { findCountryByCallingCode } from 'features/identityCheck/pages/phoneValidation/helpers/findCountry'

const normalizePhoneNumber = (input: string) => {
  const normalizedInput = input.replaceAll(/[\s.-]/g, '')
  return normalizedInput.startsWith('00') ? `+${normalizedInput.slice(2)}` : normalizedInput
}

export const sanitizePhoneNumberInput = (input: string): string => {
  const normalizedInput = normalizePhoneNumber(input)

  if (!normalizedInput.startsWith('+')) {
    return normalizedInput
  }

  const parsed = parsePhoneNumberFromString(normalizedInput)
  if (parsed?.nationalNumber) return parsed.nationalNumber

  return normalizedInput.slice(1)
}

export const formatPhoneNumberWithPrefix = (phoneNumber: string, countryCallingCode: string) => {
  const country = findCountryByCallingCode(countryCallingCode)

  let nationalNumber = sanitizePhoneNumberInput(phoneNumber)
  if (nationalNumber.startsWith('0')) {
    nationalNumber = nationalNumber.substring(1)
  }

  if (country) {
    const parsed = parsePhoneNumberFromString(nationalNumber, {
      defaultCallingCode: country.callingCode,
    })
    if (parsed?.number) return parsed.number
  }

  return `+${countryCallingCode}${nationalNumber}`
}

// returns a formatted phone number like +33 X XX XX XX XX with unbreakable spaces for display
export const formatPhoneNumberForDisplay = (phoneNumber: string, countryCode: CountryCode) => {
  const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, countryCode)
  return parsedPhoneNumber?.formatInternational().replaceAll(' ', '\u00a0') ?? ''
}
