import { CountryCode } from 'react-native-country-picker-modal'

export function isPhoneNumberValid(number: string, countryCode: CountryCode) {
  if (countryCode === 'NC') {
    // 6 digits that can be separated by whitespace, "." or "-".
    return number.match(/^\d{3}(?:[\s.-]*)\d{3}$/)
  }
  // 9 digits, 10 if the first is a "0" that can be separated by whitespace, "." or "-".
  return number.match(/^(?:0)?\s*[1-9](?:[\s.-]*\d{2}){4}$/)
}
