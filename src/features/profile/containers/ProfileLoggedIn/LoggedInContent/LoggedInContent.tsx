import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { YoungStatusType } from 'api/gen'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
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
import { getShouldDisplayHelpButton } from 'features/profile/helpers/getShouldDisplayHelpButton'
import { useGeolocationSwitch } from 'features/profile/helpers/useGeolocationSwitch'
import { UserProfile } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/LocationWrapper'

const CHATBOT_ELIGIBLE_STATUSES = new Set<YoungStatusType>([
  YoungStatusType.eligible,
  YoungStatusType.beneficiary,
  YoungStatusType.ex_beneficiary,
])

type Props = { user: UserProfile | undefined }

export const LoggedInContent = ({ user }: Props) => {
  const isChatbotFeatureEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_CHATBOT)
  const shouldDisplayHelpButton = getShouldDisplayHelpButton({ user })

  const userStatusType = user?.status?.statusType
  const isEligibleForChatbot = !!userStatusType && CHATBOT_ELIGIBLE_STATUSES.has(userStatusType)
  const shouldDisplayChatbotButton = isChatbotFeatureEnabled && isEligibleForChatbot

  const { isGeolocSwitchActive, switchGeolocation } = useGeolocationSwitch()
  const { navigate } = useNavigation<UseNavigationType>()
  const { geolocPositionError } = useLocation()

  const sharedConfig = {
    ChatbotButton: shouldDisplayChatbotButton ? <ChatbotButton /> : null,
    AppearanceButton: <AppearanceButton navigate={navigate} />,
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

  const isBeneficiary = user?.isBeneficiary

  const testID = isBeneficiary
    ? 'logged-in-beneficiary-content'
    : 'logged-in-non-beneficiary-content'

  const config = isBeneficiary
    ? loggedInBeneficiaryContentConfig(sharedConfig)
    : loggedInNonBeneficiaryContentConfig(sharedConfig)

  return <ProfileContentLayout config={config} testID={testID} />
}
