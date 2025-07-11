import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'

export interface ProfileType {
  type:
    | ProfileTypes.BOOKING_FREE_OFFER_15_16
    | ProfileTypes.IDENTITY_CHECK
    | PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA
}
