import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { useRef } from 'react'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { isLongEnough } from 'features/auth/components/PasswordSecurityRules'
import { ChangeEmailDisclaimer } from 'features/profile/pages/ChangeEmail/ChangeEmailDisclaimer'
import { useSafeState } from 'libs/hooks'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

export function ChangeEmail() {
  const [email, setEmail] = useSafeState('')
  const scrollRef = useRef<ScrollView | null>(null)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [password, setPassword] = useSafeState('')
  const { bottom } = useSafeAreaInsets()
  useForHeightKeyboardEvents(setKeyboardHeight)

  // TODO (PC-11345) : Add email check different from the current one for disabled condition
  const disabled = !isLongEnough(password) && !isEmailValid(email)

  // TODO (PC-11395) : Add correct function
  const submitEmailChange = () => 'submitEmailChange'

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <StyledScrollView
        ref={scrollRef}
        contentContainerStyle={getScrollViewContentContainerStyle(keyboardHeight)}>
        <Spacer.Column numberOfSpaces={18} />
        <ChangeEmailDisclaimer />
        <Spacer.Column numberOfSpaces={4} />
        <EmailInput label={t`Nouvel e-mail`} email={email} onEmailChange={setEmail} />
        <Spacer.Column numberOfSpaces={4} />
        <PasswordInput
          label={t`Mot de passe`}
          value={password}
          onChangeText={setPassword}
          placeholder={t`Ton mot de passe`}
          textContentType="password"
          {...accessibilityAndTestId(t`Entrée pour le mot de passe`)}
        />
        <Spacer.Flex flex={1} />
        {!!keyboardHeight && <Spacer.Column numberOfSpaces={2} />}
        <ButtonContainer paddingBottom={keyboardHeight ? 0 : bottom}>
          <ButtonPrimary title={t`Enregistrer`} onPress={submitEmailChange} disabled={disabled} />
        </ButtonContainer>
        <Spacer.Column numberOfSpaces={6} />
      </StyledScrollView>
      <PageHeader title={t`Modifier mon e-mail`} />
    </React.Fragment>
  )
}

const StyledScrollView = styled(ScrollView)({
  paddingHorizontal: getSpacing(5),
})

const getScrollViewContentContainerStyle = (keyboardHeight: number): StyleProp<ViewStyle> => ({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
  backgroundColor: ColorsEnum.WHITE,
})

const ButtonContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
}))
