import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'

export interface ProfileType {
  type: ProfileTypes.BOOKING | ProfileTypes.IDENTITY_CHECK
}
