import React from 'react'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'

export const ChatbotButton = () => (
  <StyledSectionRow
    key="ChatbotButton"
    title="Poser une question"
    type="navigable"
    navigateTo={getProfilePropConfig('Chatbot')}
    icon={LifeBuoy}
  />
)
