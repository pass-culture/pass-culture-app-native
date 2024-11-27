import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js'

export function isPhoneNumberValid(number: string, country: string) {
  const phoneNumber = parsePhoneNumberFromString(number, country as CountryCode)
  return phoneNumber?.isValid() ?? false
}
