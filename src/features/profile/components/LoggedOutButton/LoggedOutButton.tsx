import React from 'react'

import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { SectionRow } from 'ui/components/SectionRow'
import { SignOut } from 'ui/svg/icons/SignOut'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

export const LoggedOutButton = () => {
  const signOut = useLogoutRoutine()
  return (
    <SectionRow
      title="Déconnexion"
      onPress={signOut}
      type="clickable"
      icon={SignOut}
      iconSize={SECTION_ROW_ICON_SIZE}
    />
  )
}
