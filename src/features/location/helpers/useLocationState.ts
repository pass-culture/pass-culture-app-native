import { useEffect } from 'react'

import { useLocation } from 'libs/location/LocationWrapper'
import { LocationMode } from 'libs/location/types'
import {
  locationModalActions,
  useLocationModal,
  useLocationModalConfiguration,
} from 'libs/locationV2/locationModal.store'

export const useLocationState = () => {
  const { setPlaceQuery, setSelectedPlace, selectedLocationMode, place } = useLocation()

  const { radius: tempAroundMeRadius } = useLocationModalConfiguration(LocationMode.AROUND_ME)
  const { radius: tempAroundPlaceRadius } = useLocationModalConfiguration(LocationMode.AROUND_PLACE)
  const { locationMode: tempLocationMode, visible } = useLocationModal()
  const {
    setAroundMeRadius: setTempAroundMeRadius,
    setAroundPlaceRadius: setTempAroundPlaceRadius,
  } = locationModalActions

  const { setLocationMode: setTempLocationMode } = locationModalActions

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
    tempAroundMeRadius,
    setTempAroundMeRadius,
    tempAroundPlaceRadius,
    setTempAroundPlaceRadius,
    tempLocationMode,
    setTempLocationMode,
  }
}
