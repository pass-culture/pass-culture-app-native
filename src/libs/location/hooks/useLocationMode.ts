import { useEffect, useState } from 'react'

import { LocationMode } from 'libs/location/types'

export const useLocationMode = ({ hasGeolocPosition }: { hasGeolocPosition: boolean }) => {
  const [selectedLocationMode, setSelectedLocationMode] = useState<LocationMode>(
    LocationMode.EVERYWHERE
  )
  useEffect(() => {
    if (
      selectedLocationMode === LocationMode.EVERYWHERE ||
      selectedLocationMode === LocationMode.AROUND_ME
    ) {
      if (hasGeolocPosition) {
        setSelectedLocationMode(LocationMode.AROUND_ME)
      } else {
        setSelectedLocationMode(LocationMode.EVERYWHERE)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGeolocPosition])

  return {
    selectedLocationMode,
    setSelectedLocationMode,
  }
}
