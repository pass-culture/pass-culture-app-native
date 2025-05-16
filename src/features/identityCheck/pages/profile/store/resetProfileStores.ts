import { addressActions } from 'features/identityCheck/pages/profile/store/addressStore'
import { cityActions } from 'features/identityCheck/pages/profile/store/cityStore'
import { nameActions } from 'features/identityCheck/pages/profile/store/nameStore'
import { statusActions } from 'features/identityCheck/pages/profile/store/statusStore'

export const resetProfileStores = () => {
  nameActions.resetName()
  cityActions.resetCity()
  addressActions.resetAddress()
  statusActions.resetStatus()
}
