import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { isCurrentOrFormerBeneficiary } from 'features/auth/helpers/checkStatusType'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { AppearanceButton } from 'features/profile/components/AppearanceButton/AppearanceButton'
import { BugReportButton } from 'features/profile/components/Buttons/BugReportButton/BugReportButton'
import { ChatbotButton } from 'features/profile/components/Buttons/ChatbotButton/ChatbotButton'
import { HelpButtonRow } from 'features/profile/components/Buttons/HelpButton/HelpButtonRow'
import { LocationButton } from 'features/profile/components/Buttons/LocationButton/LocationButton'
import { ProfileContentLayout } from 'features/profile/components/ProfileContentLayout/ProfileContentLayout'
import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { loggedInBeneficiaryContentConfig } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/LoggedInBeneficiaryContent/loggedInBeneficiaryContentConfig'
import { loggedInNonBeneficiaryContentConfig } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/LoggedInNonBeneficiaryContent/loggedInNonBeneficiaryContentConfig'
import { CHATBOT_ELIGIBLE_STATUSES } from 'features/profile/helpers/chatbotEligibleStatuses'
import { getShouldDisplayHelpButton } from 'features/profile/helpers/getShouldDisplayHelpButton'
import { useAppearanceTag } from 'features/profile/helpers/useAppearanceTag'
import { useGeolocationSwitch } from 'features/profile/helpers/useGeolocationSwitch'
import { UserProfile } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/LocationWrapper'

type Props = { user: UserProfile | undefined }

export const LoggedInContent = ({ user }: Props) => {
  const isChatbotFeatureEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_CHATBOT)
  const enableDarkModeGtm = useFeatureFlag(RemoteStoreFeatureFlags.DARK_MODE_GTM)
  const shouldDisplayHelpButton = getShouldDisplayHelpButton({ user })

  const isEligibleForChatbot = !!user?.statusType && CHATBOT_ELIGIBLE_STATUSES.has(user?.statusType)
  const shouldDisplayChatbotButton = isChatbotFeatureEnabled && isEligibleForChatbot

  const { hasSeenAppearanceTag, markAppearanceTagSeen } = useAppearanceTag(enableDarkModeGtm)
  const { isGeolocSwitchActive, switchGeolocation } = useGeolocationSwitch()
  const { navigate } = useNavigation<UseNavigationType>()
  const { geolocPositionError } = useLocation()

  const sharedConfig = {
    ChatbotButton: shouldDisplayChatbotButton ? <ChatbotButton /> : null,
    AppearanceButton: (
      <AppearanceButton
        navigate={navigate}
        enableDarkModeGtm={enableDarkModeGtm}
        hasSeenAppearanceTag={hasSeenAppearanceTag}
        markAppearanceTagSeen={markAppearanceTagSeen}
      />
    ),
    LocationButton: (
      <LocationButton
        isGeolocSwitchActive={isGeolocSwitchActive}
        geolocPositionError={geolocPositionError}
        switchGeolocation={switchGeolocation}
      />
    ),
    HelpButton: shouldDisplayHelpButton ? <HelpButtonRow birthDate={user?.birthDate} /> : null,
    ShareBanner: <ShareBanner />,
    SocialNetwork: <SocialNetwork />,
    BugReportButton: <BugReportButton />,
  }

  const isBeneficiary = isCurrentOrFormerBeneficiary(user)

  const testID = isBeneficiary
    ? 'logged-in-beneficiary-content'
    : 'logged-in-non-beneficiary-content'

  const config = isBeneficiary
    ? loggedInBeneficiaryContentConfig(sharedConfig)
    : loggedInNonBeneficiaryContentConfig(sharedConfig)

  return <ProfileContentLayout config={config} testID={testID} />
}
