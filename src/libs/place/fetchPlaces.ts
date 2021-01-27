// eslint-disable-next-line import/no-unresolved
import { FeatureCollection, Point } from 'geojson'

import { Properties, SuggestedPlace } from './types'

const API_ADRESSE_URL = `https://api-adresse.data.gouv.fr/search`

interface Props {
  query: string
  limit?: number
}

export const buildSuggestedPlaces = (
  suggestedPlaces: FeatureCollection<Point, Properties>
): SuggestedPlace[] =>
  suggestedPlaces.features.map(({ geometry, properties }) => {
    const { city, context, name, type } = properties
    const detailedPlace = type === 'street' || type === 'housenumber'
    const [, department] = context.replace(/\s+/g, '').split(',') // department number, department name, region
    const [longitude, latitude] = geometry.coordinates

    return {
      name: {
        long: detailedPlace ? `${name}, ${city}` : city,
        short: detailedPlace ? name : city,
      },
      extraData: {
        city,
        department: department || '',
      },
      geolocation: { longitude, latitude },
    }
  })

export const fetchPlaces = ({ query, limit = 20 }: Props) =>
  fetch(`${API_ADRESSE_URL}/?limit=${limit}&q=${query}`)
    .then((response) => response.json())
    .then(buildSuggestedPlaces)
    .catch(() => [])
