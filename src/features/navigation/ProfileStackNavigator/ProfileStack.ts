import { createStackNavigator } from '@react-navigation/stack'

import {
  AccessibilityRootStackParamList,
  GenericRoute,
} from 'features/navigation/RootNavigator/types'

export type ProfileStackParamList = {
  Profile?: Record<string, unknown> // I had to put type Record<string, unknown> so that getProfileStackConfig in DeeplinksGeneratorForm can take appAndMarketingParams, otherwise I would have just put undefined.
  NotificationsSettings: undefined
  DeleteProfileAccountHacked: undefined
  DeleteProfileAccountNotDeletable: undefined
  DeleteProfileConfirmation: undefined
  DeleteProfileContactSupport: undefined
  DeleteProfileEmailHacked: undefined
  DeleteProfileReason: undefined
  DeleteProfileSuccess: undefined
  ConfirmDeleteProfile: undefined
} & AccessibilityRootStackParamList

export type ProfileStackRouteName = keyof ProfileStackParamList

export type ProfileStackRoute = GenericRoute<ProfileStackParamList>

export const ProfileStack = createStackNavigator<ProfileStackParamList>()
