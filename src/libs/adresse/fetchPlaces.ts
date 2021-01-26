import { FeatureCollection, Point } from 'geojson'

import { Properties, SuggestedPlace } from './types'

const API_ADRESSE_URL = `https://api-adresse.data.gouv.fr/search`

interface Props {
  query: string
  limit?: number
}

export const fetchPlaces = ({ query, limit = 20 }: Props) =>
  fetch(`${API_ADRESSE_URL}/?limit=${limit}&q=${query}`)
    .then((response) => response.json())
    .then((suggestedPlaces: FeatureCollection<Point, Properties>): SuggestedPlace[] => {
      return suggestedPlaces.features.map(({ geometry, properties }) => {
        const { city, context, name, type } = properties
        const detailedPlace = type === 'street' || type === 'housenumber'
        const [, department] = context.replace(/\s+/g, '').split(',') //  n° de département, nom de département et de région
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
          geolocation: {
            longitude: longitude || '',
            latitude: latitude || '',
          },
        }
      })
    })
    .catch(() => {
      return []
    })
