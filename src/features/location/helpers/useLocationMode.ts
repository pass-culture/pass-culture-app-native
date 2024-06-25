import { useGeolocationDialogs } from 'features/location/helpers/useGeolocationDialogs'
import { LocationState, LocationSubmit } from 'features/location/types'
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
  ...props
}: Props) => {
  const { runGeolocationDialogs } = useGeolocationDialogs({
    dismissModal,
    shouldOpenDirectlySettings,
    shouldDirectlyValidate,
    ...props,
  })
  const {
    tempLocationMode,
    setTempLocationMode,
    setSelectedLocationMode,
    setPlaceGlobally,
    onSubmit,
  } = props

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
        if (shouldDirectlyValidate) {
          setSelectedLocationMode(LocationMode.EVERYWHERE)
          setPlaceGlobally(null)
          dismissModal()
        } else {
          onSubmit(LocationMode.EVERYWHERE)
        }
        break

      default:
        setTempLocationMode(mode)
        break
    }
  }

  return { tempLocationMode, setTempLocationMode, selectLocationMode }
}
