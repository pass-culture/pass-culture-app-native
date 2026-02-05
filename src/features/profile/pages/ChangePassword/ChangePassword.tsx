import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { ApiError } from 'api/ApiError'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useChangePasswordMutation } from 'features/auth/queries/useChangePasswordMutation'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { changePasswordSchema } from 'features/profile/pages/ChangePassword/schema/changePasswordSchema'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { Form } from 'ui/components/Form'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Button } from 'ui/designSystem/Button/Button'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'

type ChangePasswordFormData = {
  currentPassword: string
  newPassword: string
  confirmedPassword: string
}

export function ChangePassword() {
  const defaultValues: ChangePasswordFormData = {
    currentPassword: '',
    newPassword: '',
    confirmedPassword: '',
  }
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar } = useSnackBarContext()
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const { user, isUserLoading } = useAuthContext()

  useForHeightKeyboardEvents(setKeyboardHeight)

  const { mutate: changePassword } = useChangePasswordMutation()

  const {
    handleSubmit,
    control,
    clearErrors,
    setError,
    reset,
    watch,
    trigger,
    setFocus,
    formState: { isSubmitting, isValid, isValidating, isDirty },
  } = useForm<ChangePasswordFormData>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(changePasswordSchema),
  })

  // We use this useEffect in order to validate confirmedPassword when newPassword changes and matches
  const password = watch('newPassword')
  useEffect(() => {
    trigger('confirmedPassword')
  }, [password, trigger])

  const onSubmit = handleSubmit((data: ChangePasswordFormData) => {
    // returning a promise will allow formik to set isSubmitting to false afterward
    return new Promise<void>((resolve) => {
      changePassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          onSuccess() {
            clearErrors()
            reset()
            showSuccessSnackBar({
              message: 'Ton mot de passe est modifié',
              timeout: SNACK_BAR_TIME_OUT,
            })
            navigate(...getTabHookConfig('Profile'))
            analytics.logHasChangedPassword({ from: 'personaldata', reason: 'changePassword' })
            resolve()
          },
          onError(error, { newPassword }) {
            setError('currentPassword', {
              message: 'Mot de passe incorrect',
            })
            setFocus('currentPassword')
            if (!(error instanceof ApiError)) {
              const err = new Error('ChangePasswordUnknownError')
              eventMonitoring.captureException(err, {
                extra: {
                  newPassword,
                },
              })
            }
            // no need to reject on press event, and it's harder to test
            resolve()
          },
        }
      )
    })
  })

  const disabled = !isDirty || !isValid || (!isValidating && isSubmitting)
  const onEnterKeyAction = useCallback(() => {
    if (!disabled) {
      onSubmit()
    }
  }, [disabled, onSubmit])

  useEnterKeyAction(onEnterKeyAction)

  if (!isUserLoading && !user?.hasPassword) {
    navigateToHome()
    return null
  }

  return (
    <SecondaryPageWithBlurHeader
      title="Mot de passe"
      scrollable
      scrollViewProps={{
        keyboardShouldPersistTaps: 'handled',
      }}>
      <Container paddingBottom={Platform.OS === 'ios' ? keyboardHeight : 0}>
        <Form.MaxWidth flex={1}>
          <OldPasswordContainer>
            <PasswordInputController
              control={control}
              name="currentPassword"
              label="Mot de passe actuel"
              requiredIndicator="explicit"
              autocomplete="current-password"
            />
          </OldPasswordContainer>
          <PasswordInputController
            control={control}
            name="newPassword"
            label="Nouveau mot de passe"
            autocomplete="new-password"
            withSecurityRules
            requiredIndicator="explicit"
          />
          <RepeatPasswordContainer keyboardHeight={keyboardHeight}>
            <PasswordInputController
              control={control}
              name="confirmedPassword"
              autocomplete="new-password"
              label="Confirmer le mot de passe"
              requiredIndicator="explicit"
            />
          </RepeatPasswordContainer>
          <Button
            variant="primary"
            wording="Enregistrer"
            accessibilityLabel="Enregistrer les modifications"
            onPress={onSubmit}
            disabled={disabled}
          />
        </Form.MaxWidth>
      </Container>
    </SecondaryPageWithBlurHeader>
  )
}

const Container = styled.View<{ paddingBottom: number }>(({ paddingBottom, theme }) => ({
  paddingBottom,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const OldPasswordContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const RepeatPasswordContainer = styled.View<{ keyboardHeight: number }>(
  ({ theme, keyboardHeight }) => ({
    marginTop: theme.designSystem.size.spacing.l,
    marginBottom:
      theme.designSystem.size.spacing.xl + (keyboardHeight ? theme.designSystem.size.spacing.s : 0),
  })
)
