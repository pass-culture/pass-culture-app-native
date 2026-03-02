import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { YoungStatusType } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { AppearanceButton } from 'features/profile/components/AppearanceButton/AppearanceButton'
import { ChatbotButton } from 'features/profile/components/Buttons/ChatbotButton/ChatbotButton'
import { HelpButton } from 'features/profile/components/Buttons/HelpButton/HelpButton'
import { LocationButton } from 'features/profile/components/Buttons/LocationButton/LocationButton'
import { FeedbackInAppButton } from 'features/profile/components/FeedbackInAppButton/FeedbackInAppButton'
import { ProfileContentLayout } from 'features/profile/components/ProfileContentLayout/ProfileContentLayout'
import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { loggedInBeneficiaryContentConfig } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/loggedInBeneficiaryContentConfig'
import { loggedInNonBeneficiaryContentConfig } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/loggedInNonBeneficiaryContentConfig'
import { getShouldDisplayHelpButton } from 'features/profile/helpers/getShouldDisplayHelpButton'
import { useAppearanceTag } from 'features/profile/helpers/useAppearanceTag'
import { useGeolocationSwitch } from 'features/profile/helpers/useGeolocationSwitch'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useLocation } from 'libs/location/LocationWrapper'

const CHATBOT_ELIGIBLE_STATUSES = new Set<YoungStatusType>([
  YoungStatusType.eligible,
  YoungStatusType.beneficiary,
  YoungStatusType.ex_beneficiary,
])

type Props = { user: UserProfileResponseWithoutSurvey | undefined }

export const LoggedInContent = ({ user }: Props) => {
  const { data: remoteConfig } = useRemoteConfigQuery()
  const isChatbotFeatureEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_CHATBOT)
  const enableDarkModeGtm = useFeatureFlag(RemoteStoreFeatureFlags.DARK_MODE_GTM)
  const shouldDisplayHelpButton = getShouldDisplayHelpButton({ user })

  const userStatusType = user?.status?.statusType
  const isEligibleForChatbot = !!userStatusType && CHATBOT_ELIGIBLE_STATUSES.has(userStatusType)
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
    FeedbackInAppButton: (
      <FeedbackInAppButton displayInAppFeedback={remoteConfig.displayInAppFeedback} />
    ),
    HelpButton: shouldDisplayHelpButton ? <HelpButton user={user} /> : null,
    ShareBanner: <ShareBanner />,
    SocialNetwork: <SocialNetwork />,
  }

  const isBeneficiary = user?.isBeneficiary

  const testID = isBeneficiary
    ? 'logged-in-beneficiary-content'
    : 'logged-in-non-beneficiary-content'

  const config = isBeneficiary
    ? loggedInBeneficiaryContentConfig(sharedConfig)
    : loggedInNonBeneficiaryContentConfig(sharedConfig)

  return <ProfileContentLayout config={config} testID={testID} />
}
