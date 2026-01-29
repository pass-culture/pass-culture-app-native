import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { AppearanceButton } from 'features/profile/components/AppearanceButton/AppearanceButton'
import { ChatbotButton } from 'features/profile/components/Buttons/ChatbotButton/ChatbotButton'
import { LocationButton } from 'features/profile/components/Buttons/LocationButton/LocationButton'
import { FeedbackInAppButton } from 'features/profile/components/FeedbackInAppButton/FeedbackInAppButton'
import { ProfileContentLayout } from 'features/profile/components/ProfileContentLayout/ProfileContentLayout'
import { loggedInBeneficiaryContentConfig } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/LoggedInBeneficiaryContent/loggedInBeneficiaryContentConfig'
import { useAppearanceTag } from 'features/profile/helpers/useAppearanceTag'
import { useGeolocationSwitch } from 'features/profile/helpers/useGeolocationSwitch'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useLocation } from 'libs/location/LocationWrapper'

export const LoggedInBeneficiaryContent = () => {
  const { data: remoteConfig } = useRemoteConfigQuery()
  const shouldDisplayChatbotButton = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_CHATBOT)
  const shouldDisplayAppearanceButton = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)
  const enableDarkModeGtm = useFeatureFlag(RemoteStoreFeatureFlags.DARK_MODE_GTM)
  const { hasSeenAppearanceTag, markAppearanceTagSeen } = useAppearanceTag(enableDarkModeGtm)
  const { isGeolocSwitchActive, switchGeolocation } = useGeolocationSwitch()
  const { navigate } = useNavigation<UseNavigationType>()
  const { geolocPositionError } = useLocation()

  const config = loggedInBeneficiaryContentConfig({
    ChatbotButton: shouldDisplayChatbotButton ? <ChatbotButton /> : null,
    LocationButton: (
      <LocationButton
        isGeolocSwitchActive={isGeolocSwitchActive}
        geolocPositionError={geolocPositionError}
        switchGeolocation={switchGeolocation}
      />
    ),
    AppearanceButton: shouldDisplayAppearanceButton ? (
      <AppearanceButton
        navigate={navigate}
        enableDarkModeGtm={enableDarkModeGtm}
        hasSeenAppearanceTag={hasSeenAppearanceTag}
        markAppearanceTagSeen={markAppearanceTagSeen}
      />
    ) : null,
    FeedbackInAppButton: (
      <FeedbackInAppButton displayInAppFeedback={remoteConfig.displayInAppFeedback} />
    ),
  })

  return <ProfileContentLayout config={config} testID="logged-in-beneficiary-content" />
}
