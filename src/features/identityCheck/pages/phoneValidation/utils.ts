export const formatPhoneNumberWithPrefix = (phoneNumber: string, countryCallingCode: string) => {
  let preformattedNumber = phoneNumber.replace(/[\s.-]*/g, '')
  if (preformattedNumber.startsWith('0')) {
    preformattedNumber = preformattedNumber.substring(1)
  }
  return `+${countryCallingCode}${preformattedNumber}`
}
