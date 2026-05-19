import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'

export type ProfileType =
  | ProfileTypes.BOOKING_FREE_OFFER_15_16
  | ProfileTypes.IDENTITY_CHECK
  | ProfileTypes.RECAP_EXISTING_DATA

export enum ProfileOrigin {
  HOME_BANNER = 'homeBanner',
  OFFER = 'offer',
}

export interface ProfileScreenType {
  type: ProfileType
  origin?: ProfileOrigin
  freeOfferId?: number
}
