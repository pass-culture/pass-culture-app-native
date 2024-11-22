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

  switch (cleanedNumber.length) {
    case 6:
      return isCountryWithSixDigitsAfterCallingCode && Boolean(cleanedNumber.match(/^\d{6}$/))
    case 7:
    case 8:
      return false
    case 9:
      return (
        isNotCountryWithSixDigitsAfterCallingCode &&
        startsWithOneToNine &&
        Boolean(cleanedNumber.match(/^[1-9]\d{8}$/))
      )
    case 10:
      return (
        isNotCountryWithSixDigitsAfterCallingCode &&
        startsWithZero &&
        Boolean(cleanedNumber.match(/^0\d{9}$/))
      )
    default:
      return false
  }
}
