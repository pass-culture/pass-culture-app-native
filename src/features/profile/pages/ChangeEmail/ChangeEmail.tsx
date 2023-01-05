import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { AlreadyChangedEmailDisclaimer } from 'features/profile/components/Disclaimers/AlreadyChangedEmailDisclaimer'
import { ChangeEmailDisclaimer } from 'features/profile/components/Disclaimers/ChangeEmailDisclaimer'
import { useChangeEmailMutation } from 'features/profile/helpers/useChangeEmailMutation'
import { useCheckHasCurrentEmailChange } from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { changeEmailSchema } from 'features/profile/pages/ChangeEmail/schema/changeEmailSchema'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { theme } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { getSpacing, Spacer } from 'ui/theme'

type FormValues = {
  newEmail: string
  password: string
}

export function ChangeEmail() {
  const { isMobileViewport, isTouch } = useTheme()
  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChange()
  const { user } = useAuthContext()

  const {
    control,
    handleSubmit,
    formState: { isValid },
    setError,
    watch,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      newEmail: '',
      password: '',
    },
    resolver: yupResolver(changeEmailSchema(user?.email)),
    mode: 'all',
    delayError: SUGGESTION_DELAY_IN_MS,
  })

  const { changeEmail, isLoading } = useChangeEmailMutation({
    setPasswordErrorMessage: (message: string) =>
      setError('password', { message, type: 'validate' }),
  })

  const removePasswordError = useCallback(() => {
    clearErrors('password')
  }, [clearErrors])

  const password = watch('password')

  useEffect(() => {
    removePasswordError()
  }, [password, removePasswordError])

  const scrollRef = useRef<ScrollView | null>(null)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const { bottom } = useSafeAreaInsets()
  useForHeightKeyboardEvents(setKeyboardHeight)

  const submitEmailChange = ({ newEmail, password }: FormValues) => {
    changeEmail({ email: newEmail, password })
  }

  const isSubmitButtonDisabled = !isValid || isLoading

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
            <EmailInputController
              control={control}
              name="newEmail"
              label="Nouvel e-mail"
              disabled={hasCurrentEmailChange}
              autoFocus
              isRequiredField
            />
            <Spacer.Column numberOfSpaces={4} />
            <PasswordInputController
              control={control}
              name="password"
              disabled={hasCurrentEmailChange}
              isRequiredField
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
                onPress={handleSubmit(submitEmailChange)}
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
