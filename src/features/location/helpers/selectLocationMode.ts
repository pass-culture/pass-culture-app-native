import { selectAroundMeMode } from 'features/location/helpers/selectAroundMeMode'
import { LocationMode } from 'libs/location/types'
import { locationModalActions } from 'libs/locationV2/locationModal.store'

type Options = {
  shouldOpenDirectlySettings?: boolean
}

export const createSelectLocationMode =
  ({ shouldOpenDirectlySettings = false }: Options = {}) =>
  (mode: LocationMode) => {
    if (mode === LocationMode.AROUND_ME) {
      void selectAroundMeMode({
        shouldOpenDirectlySettings,
      })
      return
    }
    locationModalActions.setLocationMode(mode)
  }
