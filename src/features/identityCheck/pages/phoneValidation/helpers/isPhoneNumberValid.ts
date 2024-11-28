import parsePhoneNumberFromString, { CountryCode, getCountries } from 'libphonenumber-js'

function isCountryCode(code: string): code is CountryCode {
  const countries: string[] = getCountries()
  return countries.includes(code)
}

export function isPhoneNumberValid(number: string, country: string) {
  if (!isCountryCode(country)) return false

  const phoneNumber = parsePhoneNumberFromString(number, country)
  return phoneNumber?.isValid() ?? false
}
