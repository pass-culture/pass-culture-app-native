import { COUNTRIES } from 'features/identityCheck/components/countryPicker/constants'

export const findCountry = (countryId: string) =>
  COUNTRIES.find((country) => country.id === countryId)
