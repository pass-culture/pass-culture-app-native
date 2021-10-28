import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { useRef } from 'react'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { isLongEnough } from 'features/auth/components/PasswordSecurityRules'
import { ChangeEmailDisclaimer } from 'features/profile/pages/ChangeEmail/ChangeEmailDisclaimer'
import { useValidateEmail } from 'features/profile/pages/ChangeEmail/utils/useValidateEmail'
import { useSafeState } from 'libs/hooks'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const changeEmailApiCallMock = (email: string, password: string) => {
  // TODO: replace by API call, once it's available

  return new Promise((resolve) => setTimeout(resolve, 2000))
}

export function ChangeEmail() {
  const [email, setEmail] = useSafeState('')
  const [password, setPassword] = useSafeState('')
  const emailErrorMessage = useValidateEmail(email)

  const scrollRef = useRef<ScrollView | null>(null)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const { bottom } = useSafeAreaInsets()
  useForHeightKeyboardEvents(setKeyboardHeight)

  const disabled = !isLongEnough(password) || (!!emailErrorMessage && email.length > 0)

  const submitEmailChange = async () => {
    try {
      await changeEmailApiCallMock(email, password)
      // TODO (PC-11417): show success snackbar
    } catch (e) {
      console.error(e)
    }
  }

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
        {!!emailErrorMessage && (
          <InputError visible messageId={emailErrorMessage} numberOfSpacesTop={1} />
        )}
        <Spacer.Column numberOfSpaces={4} />
        <PasswordInput
          label={t`Mot de passe`}
          value={password}
          onChangeText={setPassword}
          placeholder={t`Ton mot de passe`}
          textContentType="password"
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
