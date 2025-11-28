import { useGeolocationDialogs } from 'features/location/helpers/useGeolocationDialogs'
import { LocationState, LocationSubmit } from 'features/location/types'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { LocationMode } from 'libs/location/types'

type Props = {
  dismissModal: () => void
  shouldOpenDirectlySettings?: boolean
  shouldDirectlyValidate?: boolean
} & LocationState &
  LocationSubmit

export const useLocationMode = ({
  dismissModal,
  shouldOpenDirectlySettings,
  shouldDirectlyValidate,
  setAroundMeRadius,
  setTempAroundMeRadius,
  setAroundPlaceRadius,
  setTempAroundPlaceRadius,
  ...props
}: Props) => {
  const { runGeolocationDialogs } = useGeolocationDialogs({
    dismissModal,
    shouldOpenDirectlySettings,
    shouldDirectlyValidate,
    setAroundMeRadius,
    setTempAroundMeRadius,
    setAroundPlaceRadius,
    setTempAroundPlaceRadius,
    ...props,
  })
  const { tempLocationMode, setTempLocationMode, setSelectedLocationMode, setPlaceGlobally } = props

  const selectLocationMode = (mode: LocationMode) => () => {
    switch (mode) {
      case LocationMode.AROUND_ME:
        runGeolocationDialogs()
        if (shouldDirectlyValidate) {
          dismissModal()
        }
        break

      case LocationMode.EVERYWHERE:
        setTempLocationMode(LocationMode.EVERYWHERE)
        setSelectedLocationMode(LocationMode.EVERYWHERE)
        setPlaceGlobally(null)
        setAroundMeRadius(DEFAULT_RADIUS)
        setTempAroundMeRadius(DEFAULT_RADIUS)
        setAroundPlaceRadius(DEFAULT_RADIUS)
        setTempAroundPlaceRadius(DEFAULT_RADIUS)
        dismissModal()
        break

      default:
        setTempLocationMode(mode)
        break
    }
  }

  return { tempLocationMode, setTempLocationMode, selectLocationMode }
}
