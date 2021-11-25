import { buildPlaceUrl, BuildSearchAddressProps } from 'libs/place/buildUrl'

import { Collection, SuggestedPlace } from './types'

const REGEX_STARTING_WITH_NUMBERS = /^\d/

export const buildSuggestedPlaces = (collection: Collection): SuggestedPlace[] =>
  collection.features.map(({ geometry, properties }) => {
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

export const fetchPlaces = async ({
  query,
}: BuildSearchAddressProps): Promise<SuggestedPlace[]> => {
  const url = buildPlaceUrl({ query })

  try {
    const response = await fetch(url)
    const collection: Collection = await response.json()
    return buildSuggestedPlaces(collection)
  } catch (_error) {
    return []
  }
}
