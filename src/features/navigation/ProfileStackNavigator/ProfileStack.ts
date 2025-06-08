import { createStackNavigator } from '@react-navigation/stack'

import { AccessibilityRootStackParamList } from 'features/navigation/RootNavigator/types'

export type ProfileStackParamList = {
  NotificationsSettings: undefined
  DebugScreen: undefined
  DeleteProfileAccountHacked: undefined
  DeleteProfileAccountNotDeletable: undefined
  DeleteProfileConfirmation: undefined
  DeleteProfileContactSupport: undefined
  DeleteProfileEmailHacked: undefined
  DeleteProfileReason: undefined
  DeleteProfileSuccess: undefined
  ConfirmDeleteProfile: undefined
  DeactivateProfileSuccess: undefined
  SuspendAccountConfirmationWithoutAuthentication: undefined
  ChangeStatus: undefined
  ChangeCity: undefined
  ChangeEmail: { showModal: boolean } | undefined
  TrackEmailChange: undefined
  LegalNotices: undefined
  PersonalData: undefined
  ValidateEmailChange: { token: string } | undefined
  ChangePassword: undefined
  SuspendAccountConfirmation: { token: string } | undefined
  FeedbackInApp: undefined
  ProfileTutorialAgeInformationCredit: undefined
  DisplayPreference: undefined
  ConsentSettings: { onGoBack?: () => void } | undefined
  ConfirmChangeEmail: { token: string; expiration_timestamp: number } | undefined
  ChangeEmailSetPassword:
    | { token: string | null | undefined; emailSelectionToken: string | null | undefined }
    | undefined
  NewEmailSelection: { token: string | null | undefined } | undefined
} & AccessibilityRootStackParamList

export type ProfileStackRouteName = keyof ProfileStackParamList

export const ProfileStack = createStackNavigator<ProfileStackParamList>()
