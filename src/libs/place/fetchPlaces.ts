import { FeatureCollection, Point } from 'geojson'

import { Properties, SuggestedPlace } from './types'

export const API_ADRESSE_URL = `https://api-adresse.data.gouv.fr/search`
const REGEX_STARTING_WITH_NUMBERS = /^\d/

export interface PlaceProps {
  query: string
  limit?: number
  cityCode?: string | null
  postalCode?: string | null
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

export const buildSuggestedAddresses = (
  suggestedAddresses: FeatureCollection<Point, Properties>
): string[] => suggestedAddresses.features.map(({ properties }) => properties.label)

export const buildPlaceUrl = ({ query, cityCode, postalCode, limit = 20 }: PlaceProps): string => {
  let stringQueryParams = `${query}`
  if (cityCode) stringQueryParams += `&citycode=${cityCode}`
  if (postalCode) stringQueryParams += `&postcode=${postalCode}`
  return `${API_ADRESSE_URL}?q=${stringQueryParams}&limit=${limit}`
}

export const fetchPlaces = async ({ query, cityCode, postalCode, limit = 20 }: PlaceProps) => {
  const url = buildPlaceUrl({ query, cityCode, postalCode, limit })
  try {
    const response = await fetch(url)
    const json: FeatureCollection<Point, Properties> = await response.json()
    return buildSuggestedPlaces(json)
  } catch (_error) {
    return []
  }
}
