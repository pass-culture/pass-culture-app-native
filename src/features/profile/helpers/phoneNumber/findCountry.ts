import { WHITELISTED_COUNTRIES } from 'shared/countries/constants'

export const findCountry = (countryId: string) =>
  WHITELISTED_COUNTRIES.find((country) => country.id === countryId)
