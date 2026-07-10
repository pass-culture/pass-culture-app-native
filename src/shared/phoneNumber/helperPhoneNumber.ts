import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { WHITELISTED_COUNTRIES } from 'shared/countries/constants'

const getLastNineDigits = (phoneNumber: string) => phoneNumber.slice(-9)
const normalizePhoneNumber = (phoneNumber: string) => phoneNumber.replace(/\s+/g, '')

const parseStrict = (phoneNumber: string) => parsePhoneNumberFromString(phoneNumber)

const WHITELISTED_COUNTRY_IDS = new Set(WHITELISTED_COUNTRIES.map((country) => country.id))

export const getNationalNumber = (phoneNumber: string): string => {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber)

  const parsed = parseStrict(normalizedPhoneNumber)
  if (parsed?.nationalNumber) return parsed.nationalNumber

  return getLastNineDigits(normalizedPhoneNumber)
}

export const getCountryIdFromPhoneNumber = (phoneNumber?: string | null): string | undefined => {
  if (!phoneNumber) return

  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber)

  const parsedCountry = parseStrict(normalizedPhoneNumber)?.country
  if (parsedCountry && WHITELISTED_COUNTRY_IDS.has(parsedCountry)) return parsedCountry

  return undefined
}
