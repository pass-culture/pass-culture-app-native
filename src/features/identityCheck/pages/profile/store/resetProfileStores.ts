import { addressActions } from 'features/identityCheck/pages/profile/store/addressStore'

import { cityActions } from './cityStore'
import { nameActions } from './nameStore'

export const resetProfileStores = () => {
  nameActions.resetName()
  cityActions.resetCity()
  addressActions.resetAddress()
}
