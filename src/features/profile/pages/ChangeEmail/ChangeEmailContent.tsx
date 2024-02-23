import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { UserProfileResponse } from 'api/gen'
import { AlreadyChangedEmailDisclaimer } from 'features/profile/components/Disclaimers/AlreadyChangedEmailDisclaimer'
import { ChangeEmailDisclaimer } from 'features/profile/components/Disclaimers/ChangeEmailDisclaimer'
import { useChangeEmailMutation } from 'features/profile/helpers/useChangeEmailMutation'
import { changeEmailSchema } from 'features/profile/pages/ChangeEmail/schema/changeEmailSchema'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { Spacer } from 'ui/theme'

import { FormValues, CenteredContainer, ButtonContainer } from './ChangeEmail'

export function ChangeEmailContent({
  hasCurrentEmailChange,
  isMobileViewport,
  isTouch,
  user,
}: {
  hasCurrentEmailChange: boolean
  isMobileViewport: boolean | undefined
  isTouch: boolean
  user: UserProfileResponse | undefined
}) {
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

  const { bottom } = useSafeAreaInsets()

  const submitEmailChange = ({ newEmail, password }: FormValues) => {
    changeEmail({ email: newEmail, password })
  }

  const isInputDisabled = hasCurrentEmailChange
  const isSubmitButtonDisabled = !isValid || isLoading
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      {!!hasCurrentEmailChange && (
        <React.Fragment>
          <AlreadyChangedEmailDisclaimer />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      )}
      <ChangeEmailDisclaimer />
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

          <Spacer.Column numberOfSpaces={8} />
          <ButtonContainer paddingBottom={bottom}>
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
    </React.Fragment>
  )
}
