import { LocationState, LocationSubmit } from 'features/location/types'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { Action } from 'features/search/context/reducer'
import { analytics } from 'libs/analytics/provider'
import { LocationMode } from 'libs/location/types'

type Props = {
  dismissModal: () => void
  from: 'search' | 'venueMap'
  dispatch?: React.Dispatch<Action>
} & LocationState

export const getLocationSubmit = ({
  dismissModal,
  from,
  dispatch,
  tempLocationMode,
  setSelectedLocationMode,
  setPlaceGlobally,
  tempAroundPlaceRadius,
  tempAroundMeRadius,
  selectedPlace,
  setAroundPlaceRadius,
  setTempAroundMeRadius,
  setAroundMeRadius,
  setTempAroundPlaceRadius,
  aroundMeRadius,
  aroundPlaceRadius,
}: Props): LocationSubmit => {
  const onSubmit = (mode?: LocationMode) => {
    const chosenLocationMode = mode ?? tempLocationMode
    setSelectedLocationMode(chosenLocationMode)
    switch (chosenLocationMode) {
      case LocationMode.AROUND_PLACE:
        if (selectedPlace) {
          setPlaceGlobally(selectedPlace)
          setAroundPlaceRadius(tempAroundPlaceRadius)
          setTempAroundMeRadius(DEFAULT_RADIUS)
          if (dispatch) {
            dispatch({
              type: 'SET_LOCATION_PLACE',
              payload: {
                place: selectedPlace,
                aroundRadius: tempAroundPlaceRadius,
              },
            })
          }
          analytics.logUserSetLocation(from)
        }
        break

      case LocationMode.AROUND_ME:
        setPlaceGlobally(null)
        setAroundMeRadius(tempAroundMeRadius)
        setTempAroundPlaceRadius(DEFAULT_RADIUS)
        if (dispatch) {
          dispatch({
            type: 'SET_LOCATION_AROUND_ME',
            payload: tempAroundMeRadius,
          })
        }
        break

      case LocationMode.EVERYWHERE:
        setPlaceGlobally(null)
        if (dispatch) {
          dispatch({
            type: 'SET_LOCATION_EVERYWHERE',
          })
        }

        break
    }

    dismissModal()
  }

  const onClose = () => {
    setTempAroundMeRadius(aroundMeRadius)
    setTempAroundPlaceRadius(aroundPlaceRadius)
    dismissModal()
  }

  return { onSubmit, onClose }
}
