import React from 'react'

import { SectionRow } from 'ui/components/SectionRow'
import { SignOut } from 'ui/svg/icons/SignOut'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

export const LoggedOutButton = ({ onPress }: { onPress: () => Promise<void> }) => (
  <SectionRow
    title="Déconnexion"
    onPress={onPress}
    type="clickable"
    icon={SignOut}
    iconSize={SECTION_ROW_ICON_SIZE}
  />
)
