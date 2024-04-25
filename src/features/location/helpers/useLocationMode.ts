import { useGeolocationDialogs } from 'features/location/helpers/useGeolocationDialogs'
import { LocationState, LocationSubmit } from 'features/location/types'
import { LocationMode } from 'libs/location/types'

type Props = {
  dismissModal: () => void
  shouldOpenDirectlySettings?: boolean
} & LocationState &
  LocationSubmit

export const useLocationMode = ({ dismissModal, shouldOpenDirectlySettings, ...props }: Props) => {
  const { tempLocationMode, setTempLocationMode } = props
  const { runGeolocationDialogs } = useGeolocationDialogs({
    dismissModal,
    shouldOpenDirectlySettings,
    ...props,
  })
  const { onSubmit } = props

  const selectLocationMode = (mode: LocationMode) => () => {
    switch (mode) {
      case LocationMode.AROUND_ME:
        runGeolocationDialogs()
        break

      case LocationMode.EVERYWHERE:
        setTempLocationMode(LocationMode.EVERYWHERE)
        onSubmit(LocationMode.EVERYWHERE)
        break

      default:
        setTempLocationMode(mode)
        break
    }
  }

  return { tempLocationMode, setTempLocationMode, selectLocationMode }
}
