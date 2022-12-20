import React, { useEffect, useState, useRef } from 'react'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { isLongEnough } from 'features/auth/components/PasswordSecurityRules'
import { AlreadyChangedEmailDisclaimer } from 'features/profile/components/Disclaimers/AlreadyChangedEmailDisclaimer'
import { ChangeEmailDisclaimer } from 'features/profile/components/Disclaimers/ChangeEmailDisclaimer'
import { useChangeEmailMutation } from 'features/profile/helpers/useChangeEmailMutation'
import { useCheckHasCurrentEmailChange } from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { useValidateEmail } from 'features/profile/helpers/useValidateEmail'
import { useSafeState } from 'libs/hooks'
import { theme } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { EmailInput } from 'ui/components/inputs/EmailInput/EmailInput'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { getSpacing, Spacer } from 'ui/theme'

export function ChangeEmail() {
  const { isMobileViewport, isTouch } = useTheme()
  const [email, setEmail] = useSafeState('')
  const [password, setPassword] = useSafeState('')
  const { emailErrorMessage, isEmailValid } = useValidateEmail(email)
  const [passwordErrorMessage, setPasswordErrorMessage] = useSafeState<string | null>(null)
  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChange()

  const passwordInputErrorId = uuidv4()
  const emailInputErrorId = uuidv4()

  const { changeEmail, isLoading } = useChangeEmailMutation({ setPasswordErrorMessage })

  useEffect(() => {
    removePasswordError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password])

  const scrollRef = useRef<ScrollView | null>(null)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const { bottom } = useSafeAreaInsets()
  useForHeightKeyboardEvents(setKeyboardHeight)

  const removePasswordError = () => {
    setPasswordErrorMessage(null)
  }

  const submitEmailChange = () => {
    changeEmail({ email, password })
  }

  const isSubmitButtonDisabled =
    !isLongEnough(password) || !isEmailValid || !!passwordErrorMessage || isLoading

  useEnterKeyAction(!isSubmitButtonDisabled ? submitEmailChange : undefined)

  return (
    <React.Fragment>
      <PageHeaderSecondary title="Modifier mon e-mail" />
      <StyledScrollView
        ref={scrollRef}
        contentContainerStyle={getScrollViewContentContainerStyle(keyboardHeight)}
        keyboardShouldPersistTaps="handled">
        <Spacer.Column numberOfSpaces={6} />
        {hasCurrentEmailChange ? (
          <React.Fragment>
            <AlreadyChangedEmailDisclaimer />
            <Spacer.Column numberOfSpaces={4} />
          </React.Fragment>
        ) : null}
        <ChangeEmailDisclaimer />
        <Spacer.Column numberOfSpaces={4} />
        <CenteredContainer>
          <Form.MaxWidth flex={1}>
            <EmailInput
              label="Nouvel e-mail"
              email={email}
              onEmailChange={setEmail}
              disabled={hasCurrentEmailChange}
              isRequiredField
              autoFocus
              accessibilityDescribedBy={emailInputErrorId}
            />
            <InputError
              visible={!!emailErrorMessage}
              messageId={emailErrorMessage}
              numberOfSpacesTop={2}
              relatedInputId={emailInputErrorId}
            />
            <Spacer.Column numberOfSpaces={4} />
            <PasswordInput
              value={password}
              onChangeText={setPassword}
              disabled={hasCurrentEmailChange}
              accessibilityDescribedBy={passwordInputErrorId}
              isRequiredField
            />
            <InputError
              visible={!!passwordErrorMessage}
              messageId={passwordErrorMessage}
              numberOfSpacesTop={2}
              relatedInputId={passwordInputErrorId}
            />

            {isMobileViewport && isTouch ? (
              <Spacer.Flex flex={1} />
            ) : (
              <Spacer.Column numberOfSpaces={10} />
            )}

            {!!keyboardHeight && <Spacer.Column numberOfSpaces={2} />}
            <ButtonContainer paddingBottom={keyboardHeight ? 0 : bottom}>
              <ButtonPrimary
                wording="Enregistrer"
                accessibilityLabel="Enregistrer les modifications"
                onPress={submitEmailChange}
                disabled={isSubmitButtonDisabled}
              />
            </ButtonContainer>
          </Form.MaxWidth>
          <Spacer.Column numberOfSpaces={6} />
        </CenteredContainer>
      </StyledScrollView>
    </React.Fragment>
  )
}

const StyledScrollView = styled(ScrollView)({
  paddingHorizontal: getSpacing(5),
})

const CenteredContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

const getScrollViewContentContainerStyle = (keyboardHeight: number): StyleProp<ViewStyle> => ({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
  backgroundColor: theme.colors.white,
})

const ButtonContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
  alignItems: 'center',
  width: '100%',
}))
