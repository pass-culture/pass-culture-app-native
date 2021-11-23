import { FeatureCollection, Point } from 'geojson'

import { Properties } from '../types'

export const mockedSuggestedAddresses: FeatureCollection<Point, Properties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [48.862725, 2.287592],
      },
      properties: {
        label: '1 Rue Poissonnière 75002 Paris',
        score: 0.8751436363636363,
        housenumber: '1',
        id: '75102_7561_00001',
        name: '1 Rue Poissonnière',
        postcode: '75002',
        citycode: '75102',
        x: 652144.34,
        y: 6863359.65,
        city: 'Paris',
        context: '75, Paris, Île-de-France',
        type: 'housenumber',
        importance: 0.62658,
        street: 'Rue Poissonnière',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [48.8705535, 2.3477496],
      },
      properties: {
        label: '1 Boulevard Poissonnière 75002 Paris',
        score: 0.18080090909090907,
        housenumber: '1',
        id: '75102_7560_00001',
        name: '1 Boulevard Poissonnière',
        postcode: '75002',
        citycode: '75102',
        x: 652149.18,
        y: 6863589.79,
        city: 'Paris',
        context: '75, Paris, Île-de-France',
        type: 'housenumber',
        importance: 0.58256,
        street: 'Boulevard Poissonnière',
      },
    },
  ],
}
