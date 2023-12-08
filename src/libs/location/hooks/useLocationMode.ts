import { useEffect, useState } from 'react'

import { LocationMode } from 'libs/location/types'

export const useLocationMode = ({ hasGeolocPosition }: { hasGeolocPosition: boolean }) => {
  const [tempLocationMode, setTempLocationMode] = useState<LocationMode>(LocationMode.EVERYWHERE)

  useEffect(() => {
    if (
      tempLocationMode === LocationMode.EVERYWHERE ||
      tempLocationMode === LocationMode.AROUND_ME
    ) {
      if (hasGeolocPosition) {
        setTempLocationMode(LocationMode.AROUND_ME)
      } else {
        setTempLocationMode(LocationMode.EVERYWHERE)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGeolocPosition])

  const isCurrentLocationMode = (target: LocationMode) => tempLocationMode === target

  return {
    tempLocationMode,
    setTempLocationMode,
    isCurrentLocationMode,
  }
}
