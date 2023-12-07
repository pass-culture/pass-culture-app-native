import { useEffect, useState } from 'react'

import { LocationMode } from 'libs/location/types'

export const useLocationMode = ({ hasGeolocPosition }: { hasGeolocPosition: boolean }) => {
  const [selectedLocationMode, setSelectedLocationMode] = useState<LocationMode>(LocationMode.NONE)

  useEffect(() => {
    if (
      selectedLocationMode === LocationMode.NONE ||
      selectedLocationMode === LocationMode.GEOLOCATION
    ) {
      if (hasGeolocPosition) {
        setSelectedLocationMode(LocationMode.GEOLOCATION)
      } else {
        setSelectedLocationMode(LocationMode.NONE)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGeolocPosition])

  const isCurrentLocationMode = (target: LocationMode) => selectedLocationMode === target

  return {
    selectedLocationMode,
    setSelectedLocationMode,
    isCurrentLocationMode,
  }
}
