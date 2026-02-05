import React from 'react'

import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { SignOut } from 'ui/svg/icons/SignOut'

type LoggedOutButtonProps = { onPress: () => Promise<void> }

export const LoggedOutButton = ({ onPress }: LoggedOutButtonProps) => (
  <StyledSectionRow title="Déconnexion" onPress={onPress} type="clickable" icon={SignOut} />
)
