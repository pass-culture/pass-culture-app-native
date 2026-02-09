import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { AppearanceButton } from 'features/profile/components/AppearanceButton/AppearanceButton'
import { ChatbotButton } from 'features/profile/components/Buttons/ChatbotButton/ChatbotButton'
import { HelpButton } from 'features/profile/components/Buttons/HelpButton/HelpButton'
import { LocationButton } from 'features/profile/components/Buttons/LocationButton/LocationButton'
import { ProfileContentLayout } from 'features/profile/components/ProfileContentLayout/ProfileContentLayout'
import { loggedOutContentConfig } from 'features/profile/containers/ProfileLoggedOut/LoggedOutContent/loggedOutContentConfig'
import { getShouldDisplayHelpButton } from 'features/profile/helpers/getShouldDisplayHelpButton'
import { useAppearanceTag } from 'features/profile/helpers/useAppearanceTag'
import { useGeolocationSwitch } from 'features/profile/helpers/useGeolocationSwitch'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/LocationWrapper'

type Props = { user: UserProfileResponseWithoutSurvey | undefined }

export const LoggedOutContent = ({ user }: Props) => {
  const shouldDisplayChatbotButton = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_CHATBOT)
  const shouldDisplayAppearanceButton = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)
  const enableDarkModeGtm = useFeatureFlag(RemoteStoreFeatureFlags.DARK_MODE_GTM)
  const shouldDisplayHelpButton = getShouldDisplayHelpButton({ user })
  const { hasSeenAppearanceTag, markAppearanceTagSeen } = useAppearanceTag(enableDarkModeGtm)
  const { isGeolocSwitchActive, switchGeolocation } = useGeolocationSwitch()
  const { navigate } = useNavigation<UseNavigationType>()
  const { geolocPositionError } = useLocation()

  const config = loggedOutContentConfig({
    ChatbotButton: shouldDisplayChatbotButton ? <ChatbotButton /> : null,
    HelpButton: shouldDisplayHelpButton ? <HelpButton user={user} /> : null,
    AppearanceButton: shouldDisplayAppearanceButton ? (
      <AppearanceButton
        navigate={navigate}
        enableDarkModeGtm={enableDarkModeGtm}
        hasSeenAppearanceTag={hasSeenAppearanceTag}
        markAppearanceTagSeen={markAppearanceTagSeen}
      />
    ) : null,
    LocationButton: (
      <LocationButton
        isGeolocSwitchActive={isGeolocSwitchActive}
        geolocPositionError={geolocPositionError}
        switchGeolocation={switchGeolocation}
      />
    ),
  })

  return <ProfileContentLayout config={config} testID="logged-out-content" />
}
