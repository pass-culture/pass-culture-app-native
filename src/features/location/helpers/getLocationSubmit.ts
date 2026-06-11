import { LocationState, LocationSubmit } from 'features/location/types'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { Action } from 'features/search/context/reducer'
import { analytics } from 'libs/analytics/provider'
import { LocationMode } from 'libs/location/types'

type Props = {
  from: 'search' | 'venueMap'
  dispatch?: React.Dispatch<Action>
  tempLocationMode: LocationState['tempLocationMode']
  setSelectedLocationMode: LocationState['setSelectedLocationMode']
  setPlace: LocationState['setPlace']
  tempAroundPlaceRadius: number
  tempAroundMeRadius: LocationState['tempAroundMeRadius']
  selectedPlace: LocationState['selectedPlace']
  setAroundPlaceRadius: LocationState['setAroundPlaceRadius']
  setTempAroundMeRadius: LocationState['setTempAroundMeRadius']
  setAroundMeRadius: LocationState['setAroundMeRadius']
  setTempAroundPlaceRadius: LocationState['setTempAroundPlaceRadius']
  aroundMeRadius: LocationState['aroundMeRadius']
  aroundPlaceRadius: LocationState['aroundPlaceRadius']
}

export const getLocationSubmit = ({
  from,
  dispatch,
  tempLocationMode,
  setSelectedLocationMode,
  setPlace,
  tempAroundPlaceRadius,
  tempAroundMeRadius,
  selectedPlace,
  setAroundPlaceRadius,
  setTempAroundMeRadius,
  setAroundMeRadius,
  setTempAroundPlaceRadius,
}: Props): LocationSubmit => {
  const onSubmit = (mode?: LocationMode) => {
    const chosenLocationMode = mode ?? tempLocationMode
    setSelectedLocationMode(chosenLocationMode)
    switch (chosenLocationMode) {
      case LocationMode.AROUND_PLACE:
        if (selectedPlace) {
          setPlace(selectedPlace)
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
          void analytics.logUserSetLocation(from)
        }
        break

      case LocationMode.AROUND_ME:
        setPlace(null)
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
        setPlace(null)
        if (dispatch) {
          dispatch({
            type: 'SET_LOCATION_EVERYWHERE',
          })
        }

        break
    }
  }

  return { onSubmit }
}
