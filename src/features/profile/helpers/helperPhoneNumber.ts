import { COUNTRIES } from 'features/identityCheck/components/countryPicker/constants'

export const getLastNineDigits = (phoneNumber: string) => phoneNumber.slice(-9)

export const getCountryIdFromPhoneNumber = (phoneNumber?: string | null): string | undefined => {
  if (!phoneNumber) return
  const countryId = phoneNumber.slice(0, -9)
  const cleanCode = countryId.replace(/^\+/, '')
  const country = COUNTRIES.find((c) => c.callingCode === cleanCode)
  return country?.id ?? undefined
}
