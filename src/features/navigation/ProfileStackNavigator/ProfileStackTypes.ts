import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import { AccessibilityRootStackParamList } from 'features/navigation/RootNavigator/types'

interface PersonalDataType {
  type: PersonalDataTypes.PROFIL_PERSONAL_DATA | PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA
}

export type ProfileStackParamList = {
  ChangeAddress: PersonalDataType | undefined
  ChangeCity: PersonalDataType | undefined
  ChangeEmail: { showModal: boolean } | undefined
  ChangePassword: undefined
  ChangeStatus: PersonalDataType | undefined
  ConfirmChangeEmail: { token: string; expiration_timestamp: number } | undefined
  MandatoryUpdatePersonalData: undefined
  UpdatePersonalDataConfirmation: undefined
  ProfileInformationValidationUpdate: undefined
  ConfirmDeleteProfile: undefined
  ConsentSettings: { onGoBack?: () => void } | undefined
  DeactivateProfileSuccess: undefined
  DebugScreen: undefined
  DeleteProfileAccountHacked: undefined
  DeleteProfileAccountNotDeletable: undefined
  DeleteProfileConfirmation: undefined
  DeleteProfileContactSupport: undefined
  DeleteProfileEmailHacked: undefined
  DeleteProfileReason: undefined
  DeleteProfileSuccess: undefined
  DisplayPreference: undefined
  FeedbackInApp: undefined
  LegalNotices: undefined
  NotificationsSettings: undefined
  PersonalData: undefined
  ProfileTutorialAgeInformationCredit: undefined
  SuspendAccountConfirmation: { token: string } | undefined
  SuspendAccountConfirmationWithoutAuthentication: undefined
  TrackEmailChange: undefined
  ValidateEmailChange: { token: string } | undefined
  ChangeEmailSetPassword:
    | { token: string | null | undefined; emailSelectionToken: string | null | undefined }
    | undefined
  NewEmailSelection: { token: string | null | undefined } | undefined
} & AccessibilityRootStackParamList

export type ProfileStackRouteName = keyof ProfileStackParamList
