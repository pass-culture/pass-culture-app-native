import { LocationMode } from 'features/location/enums'

export const isCurrentLocationMode = (selectedLocationMode: LocationMode, target: LocationMode) =>
  selectedLocationMode === target
