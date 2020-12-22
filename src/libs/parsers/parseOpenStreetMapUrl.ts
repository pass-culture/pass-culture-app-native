import { Coordinates } from 'api/gen'

export const parseOpenStreetMapUrl = (coordinates: Required<Coordinates>): string =>
  `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${coordinates.latitude}%2C${coordinates.longitude}#map=16/${coordinates.latitude}/${coordinates.longitude}`
