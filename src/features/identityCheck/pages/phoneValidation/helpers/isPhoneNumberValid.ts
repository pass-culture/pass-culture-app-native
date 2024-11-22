import { Country } from 'features/identityCheck/components/countryPicker/types'

const callingCodeWithSixDigitsAfter = ['687', '681']

export function isPhoneNumberValid(number: string, countryCallingCode: Country['callingCode']) {
  const cleanedNumber = number.replace(/[-.]/g, '')

  const isNotOnlyDigits = !/^\d+$/.test(cleanedNumber)
  if (isNotOnlyDigits) return false

  const isCountryWithSixDigitsAfterCallingCode =
    callingCodeWithSixDigitsAfter.includes(countryCallingCode)
  const isNotCountryWithSixDigitsAfterCallingCode = !isCountryWithSixDigitsAfterCallingCode

  const startsWithZero = cleanedNumber.startsWith('0')
  const startsWithOneToNine = /^[1-9]/.test(cleanedNumber)

  const sixDigitRegex = /^\d{6}$/
  const nineDigitRegex = /^[1-9]\d{8}$/
  const tenDigitRegex = /^0\d{9}$/

  switch (cleanedNumber.length) {
    case 6:
      return isCountryWithSixDigitsAfterCallingCode && !!sixDigitRegex.exec(cleanedNumber)
    case 7:
    case 8:
      return false
    case 9:
      return (
        isNotCountryWithSixDigitsAfterCallingCode &&
        startsWithOneToNine &&
        !!nineDigitRegex.exec(cleanedNumber)
      )
    case 10:
      return (
        isNotCountryWithSixDigitsAfterCallingCode &&
        startsWithZero &&
        !!tenDigitRegex.exec(cleanedNumber)
      )
    default:
      return false
  }
}
