import { FeatureCollection, Point } from 'geojson'

import { Properties } from '../types'

export const mockedSuggestedPlaces: FeatureCollection<Point, Properties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-52.669736, 5.16186],
      },
      properties: {
        label: 'Kourou',
        score: 0.9503963636363636,
        id: '97304',
        type: 'municipality',
        name: 'Kourou',
        postcode: '97310',
        citycode: '97304',
        x: 314922.74,
        y: 570798.78,
        population: 26522,
        city: 'Kourou',
        context: '973, Guyane',
        importance: 0.45436,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-52.650479, 5.172018],
      },
      properties: {
        label: 'Avenue Gaston Monnerville 97310 Kourou',
        score: 0.6992372727272727,
        id: '97304_0461',
        name: 'Avenue Gaston Monnerville',
        postcode: '97310',
        citycode: '97304',
        x: 317060.73,
        y: 571916.53,
        city: 'Kourou',
        context: '973, Guyane',
        type: 'street',
        importance: 0.69161,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-52.70929, 5.146602],
      },
      properties: {
        label: 'Route Degrad Saramaca 97310 Kourou',
        score: 0.6989936363636362,
        id: '97304_0167',
        name: 'Route Degrad Saramaca',
        postcode: '97310',
        citycode: '97304',
        x: 310532.68,
        y: 569123.07,
        city: 'Kourou',
        context: '973, Guyane',
        type: 'street',
        importance: 0.68893,
      },
    },
  ],
}
