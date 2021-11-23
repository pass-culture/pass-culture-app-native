import { FeatureCollection, Point } from 'geojson'

import { Properties } from './types'

const API_ADRESSE_URL = `https://api-adresse.data.gouv.fr/search`

interface AddressProps {
  query: string
  cityCode?: string | null
  postalCode?: string | null
}

export const buildSuggestedAddresses = (
  suggestedAddresses: FeatureCollection<Point, Properties>
): string[] =>
  suggestedAddresses.features.map(({ properties }) => {
    const { label } = properties
    return `${label}`
  })

export const fetchAddresses = ({ query, cityCode, postalCode }: AddressProps) => {
  let stringQueryParams = `&q=${query}`
  if (cityCode) stringQueryParams += `&citycode=${cityCode}`
  if (postalCode) stringQueryParams += `&postcode=${postalCode}`
  return fetch(`${API_ADRESSE_URL}/?limit=10${stringQueryParams}`)
    .then((response) => response.json())
    .then(buildSuggestedAddresses)
    .catch(() => [])
}
