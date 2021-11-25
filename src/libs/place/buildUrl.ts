const API_ADRESSE_URL = `https://api-adresse.data.gouv.fr/search`

export interface BuildSearchAddressProps {
  query: string
  limit?: number
  cityCode?: string | null
  postalCode?: string | null
}

export const buildPlaceUrl = ({
  query,
  cityCode,
  postalCode,
  limit = 20,
}: BuildSearchAddressProps): string => {
  let stringQueryParams = `${query}`
  if (cityCode) stringQueryParams += `&citycode=${cityCode}`
  if (postalCode) stringQueryParams += `&postcode=${postalCode}`
  return `${API_ADRESSE_URL}?q=${stringQueryParams}&limit=${limit}`
}
