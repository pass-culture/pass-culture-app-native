import { UserProfileResponse } from 'api/gen'
import { ShareContent } from 'libs/share/types'

export interface WebShareModalProps {
  visible: boolean
  headerTitle: string
  shareContent: ShareContent
  dismissModal: () => void
}

export enum ShareAppModalType {
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  BENEFICIARY = 'BENEFICIARY',
  ON_BOOKING_SUCCESS = 'ON_BOOKING_SUCCESS',
}

// Delete this type once needsToFillCulturalSurvey is no longer in UserProfileResponseWithoutSurvey of api.gen
export type UserProfileResponseWithoutSurvey = Omit<
  UserProfileResponse,
  'needsToFillCulturalSurvey'
>
