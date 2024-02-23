import React from 'react'
import { Platform, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useCheckHasCurrentEmailChange } from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { ChangeEmailContentDeprecated } from 'features/profile/pages/ChangeEmail/ChangeEmailContentDeprecated'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { theme } from 'theme'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'

import { ChangeEmailContent } from './ChangeEmailContent'

export function ChangeEmail() {
  const disableOldChangeEmail = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_OLD_CHANGE_EMAIL)
  const enableNewChangeEmail = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_NEW_CHANGE_EMAIL)
  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChange()
  const { user } = useAuthContext()

  const showNewChangeEmail = enableNewChangeEmail && !disableOldChangeEmail

  return (
    <React.Fragment>
      {showNewChangeEmail ? (
        <SecondaryPageWithBlurHeader headerTitle="Modifier mon e-mail">
          <ChangeEmailContent hasCurrentEmailChange={hasCurrentEmailChange} user={user} />
        </SecondaryPageWithBlurHeader>
      ) : (
        <React.Fragment>
          <PageHeaderSecondary title="Modifier mon e-mail" />
          <ChangeEmailContentDeprecated
            disableOldChangeEmail={disableOldChangeEmail}
            hasCurrentEmailChange={hasCurrentEmailChange}
            user={user}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const CenteredContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

export const getScrollViewContentContainerStyle = (
  keyboardHeight: number
): StyleProp<ViewStyle> => ({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
  backgroundColor: theme.colors.white,
})

export const ButtonContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
  alignItems: 'center',
  width: '100%',
}))
