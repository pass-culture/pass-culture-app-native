import { selectAroundMeMode } from 'features/location/helpers/selectAroundMeMode'
import { LocationSubmit } from 'features/location/types'
import { LocationMode } from 'libs/location/types'
import { locationActions } from 'libs/locationV2/location.store'
import { locationModalActions } from 'libs/locationV2/locationModal.store'

type Options = {
  shouldOpenDirectlySettings?: boolean
  shouldDirectlyValidate?: boolean
  onSubmit: LocationSubmit['onSubmit']
}

export const createSelectLocationMode =
  ({ shouldOpenDirectlySettings, shouldDirectlyValidate, onSubmit }: Options) =>
  (mode: LocationMode) => {
    switch (mode) {
      case LocationMode.AROUND_ME:
        void selectAroundMeMode({
          shouldOpenDirectlySettings,
          shouldDirectlyValidate,
        })
        break
      case LocationMode.EVERYWHERE:
        locationModalActions.setLocationMode(LocationMode.EVERYWHERE)
        if (shouldDirectlyValidate) {
          locationActions.setLocationMode(LocationMode.EVERYWHERE)
          locationActions.setPlace(null)
          locationModalActions.hide()
        } else {
          onSubmit(LocationMode.EVERYWHERE)
        }
        break

      default:
        locationModalActions.setLocationMode(mode)
        break
    }
  }
