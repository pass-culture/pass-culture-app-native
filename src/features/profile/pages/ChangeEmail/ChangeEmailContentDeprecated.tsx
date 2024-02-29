import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { UserProfileResponse } from 'api/gen'
import { UpdateAppBanner } from 'features/profile/components/Banners/UpdateAppBanner'
import { AlreadyChangedEmailDisclaimer } from 'features/profile/components/Disclaimers/AlreadyChangedEmailDisclaimer'
import { ChangeEmailDisclaimerDeprecated } from 'features/profile/components/Disclaimers/ChangeEmailDisclaimerDeprecated'
import { useChangeEmailMutationV1 } from 'features/profile/helpers/useChangeEmailMutationV1'
import { changeEmailSchema } from 'features/profile/pages/ChangeEmail/schema/changeEmailSchema'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { getSpacing, Spacer } from 'ui/theme'

type FormValues = {
  newEmail: string
  password: string
}

import {
  getScrollViewContentContainerStyle,
  CenteredContainer,
  ButtonContainer,
} from './ChangeEmail'

export function ChangeEmailContentDeprecated({
  disableOldChangeEmail,
  hasCurrentEmailChange,

  user,
}: {
  disableOldChangeEmail: boolean | undefined
  hasCurrentEmailChange: boolean
  user: UserProfileResponse | undefined
}) {
  const { isMobileViewport, isTouch } = useTheme()

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

  const { changeEmail, isLoading } = useChangeEmailMutationV1({
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

  const isInputDisabled = disableOldChangeEmail || hasCurrentEmailChange
  const isSubmitButtonDisabled = disableOldChangeEmail || !isValid || isLoading
  return (
    <StyledScrollView
      ref={scrollRef}
      contentContainerStyle={getScrollViewContentContainerStyle(keyboardHeight)}
      keyboardShouldPersistTaps="handled">
      <Spacer.Column numberOfSpaces={6} />
      {!!disableOldChangeEmail && (
        <React.Fragment>
          <UpdateAppBanner />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      )}
      {!!hasCurrentEmailChange && (
        <React.Fragment>
          <AlreadyChangedEmailDisclaimer />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      )}
      <ChangeEmailDisclaimerDeprecated />
      <Spacer.Column numberOfSpaces={4} />
      <CenteredContainer>
        <Form.MaxWidth flex={1}>
          <EmailInputController
            control={control}
            name="newEmail"
            label="Nouvelle adresse e-mail"
            placeholder="email@exemple.com"
            disabled={isInputDisabled}
            autoFocus
            isRequiredField
          />
          <Spacer.Column numberOfSpaces={4} />
          <PasswordInputController
            control={control}
            name="password"
            disabled={isInputDisabled}
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
              wording="Valider la demande"
              accessibilityLabel="Valider la demande de modification de mon e-mail"
              onPress={handleSubmit(submitEmailChange)}
              disabled={isSubmitButtonDisabled}
            />
          </ButtonContainer>
        </Form.MaxWidth>
        <Spacer.Column numberOfSpaces={6} />
      </CenteredContainer>
    </StyledScrollView>
  )
}

const StyledScrollView = styled(ScrollView)({
  paddingHorizontal: getSpacing(5),
})
