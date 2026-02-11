import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js'

export const formatPhoneNumberWithPrefix = (phoneNumber: string, countryCallingCode: string) => {
  let preformattedNumber = phoneNumber.replace(/[\s.-]*/g, '')
  if (preformattedNumber.startsWith('0')) {
    preformattedNumber = preformattedNumber.substring(1)
  }
  return `+${countryCallingCode}${preformattedNumber}`
}

// returns a formatted phone number like +33 X XX XX XX XX with unbreakable spaces for display
export const formatPhoneNumberForDisplay = (phoneNumber: string, countryCode: CountryCode) => {
  const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, countryCode)
  return parsedPhoneNumber?.formatInternational().replaceAll(' ', '\u00a0') ?? ''
}
