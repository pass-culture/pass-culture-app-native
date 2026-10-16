export const formatPhoneNumberWithPrefix = (phoneNumber: string, countryCallingCode: string) => {
  let preformattedNumber = phoneNumber.replaceAll(/[\s.-]/g, '')
  if (preformattedNumber.startsWith('0')) {
    preformattedNumber = preformattedNumber.substring(1)
  }
  return `+${countryCallingCode}${preformattedNumber}`
}
