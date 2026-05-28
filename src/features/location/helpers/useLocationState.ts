import { useState, useEffect } from 'react'

import { DEFAULT_RADIUS } from 'features/search/constants'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'

type Props = {
  visible: boolean
}

export const useLocationState = ({ visible }: Props) => {
  const { setPlaceQuery, setSelectedPlace, selectedLocationMode, place } = useLocation()

  const [tempAroundMeRadius, setTempAroundMeRadius] = useState<number>(DEFAULT_RADIUS)
  const [tempAroundPlaceRadius, setTempAroundPlaceRadius] = useState<number>(DEFAULT_RADIUS)
  const [tempLocationMode, setTempLocationMode] = useState<LocationMode>(selectedLocationMode)

  useEffect(() => {
    if (visible) {
      setTempLocationMode(selectedLocationMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocationMode, visible])

  useEffect(() => {
    if (visible) {
      setPlaceQuery(place?.label ?? '')
      setSelectedPlace(place)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return {
    selectedLocationMode,
    tempAroundMeRadius,
    setTempAroundMeRadius,
    tempAroundPlaceRadius,
    setTempAroundPlaceRadius,
    tempLocationMode,
    setTempLocationMode,
  }
}
