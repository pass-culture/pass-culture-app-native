import { selectAroundMeMode } from 'features/location/helpers/selectAroundMeMode'
import { LocationMode } from 'libs/location/types'
import { locationModalActions } from 'libs/locationV2/locationModal.store'

export const createSelectLocationMode = () => async (mode: LocationMode) => {
  if (mode === LocationMode.AROUND_ME) {
    return selectAroundMeMode()
  }
  locationModalActions.setLocationMode(mode)
}
