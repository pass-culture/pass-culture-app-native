import React from 'react'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useCheckHasCurrentEmailChange } from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { theme } from 'theme'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { getSpacing } from 'ui/theme'

import { ChangeEmailContent } from './ChangeEmailContent'

export type FormValues = {
  newEmail: string
  password: string
}

export function ChangeEmail() {
  const disableOldChangeEmail = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_OLD_CHANGE_EMAIL)
  const { isMobileViewport, isTouch } = useTheme()
  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChange()
  const { user } = useAuthContext()

  return (
    <React.Fragment>
      <PageHeaderSecondary title="Modifier mon e-mail" />
      <ChangeEmailContent
        disableOldChangeEmail={disableOldChangeEmail}
        hasCurrentEmailChange={hasCurrentEmailChange}
        isMobileViewport={isMobileViewport}
        isTouch={isTouch}
        user={user}
      />
    </React.Fragment>
  )
}

export const StyledScrollView = styled(ScrollView)({
  paddingHorizontal: getSpacing(5),
})

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
