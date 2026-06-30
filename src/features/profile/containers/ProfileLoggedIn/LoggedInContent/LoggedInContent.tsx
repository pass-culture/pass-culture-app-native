import React from 'react'

import { AppearanceButton } from 'features/profile/components/AppearanceButton/AppearanceButton'
import { BugReportButton } from 'features/profile/components/Buttons/BugReportButton/BugReportButton'
import { ChatbotButton } from 'features/profile/components/Buttons/ChatbotButton/ChatbotButton'
import { HelpButtonRow } from 'features/profile/components/Buttons/HelpButton/HelpButtonRow'
import { ProfileContentLayout } from 'features/profile/components/ProfileContentLayout/ProfileContentLayout'
import { ShareBanner } from 'features/profile/components/ShareBanner/ShareBanner'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { loggedInBeneficiaryContentConfig } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/LoggedInBeneficiaryContent/loggedInBeneficiaryContentConfig'
import { loggedInNonBeneficiaryContentConfig } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/LoggedInNonBeneficiaryContent/loggedInNonBeneficiaryContentConfig'
import { CHATBOT_ELIGIBLE_STATUSES } from 'features/profile/helpers/chatbotEligibleStatuses'
import { getShouldDisplayHelpButton } from 'features/profile/helpers/getShouldDisplayHelpButton'
import { UserProfile } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { isCurrentOrFormerBeneficiary } from 'shared/user/checkStatusType'

type Props = { user: UserProfile | undefined }

export const LoggedInContent = ({ user }: Props) => {
  const isChatbotFeatureEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_CHATBOT)
  const shouldDisplayHelpButton = getShouldDisplayHelpButton({ user })

  const isEligibleForChatbot = !!user?.statusType && CHATBOT_ELIGIBLE_STATUSES.has(user?.statusType)
  const shouldDisplayChatbotButton = isChatbotFeatureEnabled && isEligibleForChatbot

  const sharedConfig = {
    ChatbotButton: shouldDisplayChatbotButton ? <ChatbotButton /> : null,
    AppearanceButton: <AppearanceButton />,
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
