import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'

export type ProfileType =
  | ProfileTypes.BOOKING_FREE_OFFER_15_16
  | ProfileTypes.IDENTITY_CHECK
  | ProfileTypes.RECAP_EXISTING_DATA

export interface ProfileScreenType {
  type: ProfileType
}
