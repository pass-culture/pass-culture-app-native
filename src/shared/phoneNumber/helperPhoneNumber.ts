import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js'

import { WHITELISTED_COUNTRIES } from 'shared/countries/constants'

const getLastNineDigits = (phoneNumber: string) => phoneNumber.slice(-9)

export const getNationalNumber = (phoneNumber: string): string => {
  const country = WHITELISTED_COUNTRIES.find((c) => phoneNumber.startsWith(`+${c.callingCode}`))
  if (country) {
    const parsed = parsePhoneNumberFromString(phoneNumber, country.id as CountryCode)
    if (parsed?.nationalNumber) return parsed.nationalNumber
  }
  return getLastNineDigits(phoneNumber)
}

export const getCountryIdFromPhoneNumber = (phoneNumber?: string | null): string | undefined => {
  if (!phoneNumber) return
  const countryId = phoneNumber.slice(0, -9)
  const cleanCode = countryId.replace(/^\+/, '')
  const country = WHITELISTED_COUNTRIES.find((c) => c.callingCode === cleanCode)
  return country?.id ?? undefined
}
