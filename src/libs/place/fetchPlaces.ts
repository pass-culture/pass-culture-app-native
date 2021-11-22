import { FeatureCollection, Point } from 'geojson'

import { Properties, SuggestedPlace } from './types'

const API_ADRESSE_URL = `https://api-adresse.data.gouv.fr/search`
const REGEX_STARTING_WITH_NUMBERS = /^\d/

interface Props {
  query: string
  limit?: number
}

export const buildSuggestedPlaces = (
  suggestedPlaces: FeatureCollection<Point, Properties>
): SuggestedPlace[] =>
  suggestedPlaces.features.map(({ geometry, properties }) => {
    const { city, context, name, type } = properties
    const detailedPlace = type === 'street' || type === 'housenumber' || type === 'locality'
    const [, department] = context.replace(/\s+/g, '').split(',') // department number, department name, region
    const [longitude, latitude] = geometry.coordinates

    const shortName = detailedPlace ? name : city
    const longName = detailedPlace ? `${name}, ${city}` : city

    const placeNameStartsWithNumbers = REGEX_STARTING_WITH_NUMBERS.test(shortName)

    return {
      label: placeNameStartsWithNumbers ? shortName : longName,
      info: placeNameStartsWithNumbers ? city : department || '',
      geolocation: { longitude, latitude },
    }
  })

export const fetchPlaces = ({ query, limit = 20 }: Props) =>
  fetch(`${API_ADRESSE_URL}/?limit=${limit}&q=${query}`)
    .then((response) => response.json())
    .then(buildSuggestedPlaces)
    .catch(() => [])

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
