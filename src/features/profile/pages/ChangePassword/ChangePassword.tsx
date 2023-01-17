import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { ApiError } from 'api/apiHelpers'
import { useChangePasswordMutation } from 'features/auth/api/useChangePasswordMutation'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { changePasswordSchema } from 'features/profile/pages/ChangePassword/schema/changePasswordSchema'
import { analytics } from 'libs/firebase/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { AppThemeType } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { getSpacing, Spacer } from 'ui/theme'

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

  const theme = useTheme()
  const { isMobileViewport, isTouch } = theme
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar } = useSnackBarContext()
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useForHeightKeyboardEvents(setKeyboardHeight)

  const { mutate: changePassword } = useChangePasswordMutation()

  const scrollRef = useRef<ScrollView | null>(null)
  const { bottom } = useSafeAreaInsets()

  const {
    handleSubmit,
    control,
    clearErrors,
    setError,
    reset,
    formState: { isSubmitting, isValid, isValidating, isDirty },
  } = useForm<ChangePasswordFormData>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(changePasswordSchema),
  })

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
            navigate(...getTabNavConfig('Profile'))
            analytics.logHasChangedPassword('changePassword')
            resolve()
          },
          onError(error, { newPassword }) {
            setError('currentPassword', {
              message: 'Mot de passe incorrect',
            })
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

  const onFocusConfirmedPassword = useCallback(() => {
    setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 60)
  }, [])

  const disabled = !isDirty || !isValid || (!isValidating && isSubmitting)
  const onEnterKeyAction = useCallback(() => {
    if (!disabled) {
      onSubmit()
    }
  }, [disabled, onSubmit])

  useEnterKeyAction(onEnterKeyAction)

  const contentContainerStyle = useMemo(() => {
    return getScrollViewContentContainerStyle(theme, keyboardHeight)
  }, [theme, keyboardHeight])

  return (
    <Container>
      <PageHeaderSecondary title="Mot de passe" />
      <StyledScrollView
        ref={scrollRef}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="handled">
        <Spacer.Column numberOfSpaces={8} />
        <Form.MaxWidth flex={1}>
          <PasswordInputController
            control={control}
            name={'currentPassword'}
            label="Mot de passe actuel"
            placeholder="Ton mot de passe actuel"
            isRequiredField
          />
          <Spacer.Column numberOfSpaces={7} />
          <PasswordInputController
            control={control}
            name="newPassword"
            label="Nouveau mot de passe"
            placeholder="Ton nouveau mot de passe"
            withSecurityRules
          />
          <Spacer.Column numberOfSpaces={5} />
          <PasswordInputController
            control={control}
            name="confirmedPassword"
            label="Confirmer le mot de passe"
            placeholder="Confirmer le mot de passe"
            onFocus={onFocusConfirmedPassword}
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
              onPress={onSubmit}
              disabled={disabled}
            />
          </ButtonContainer>
        </Form.MaxWidth>
        <Spacer.Column numberOfSpaces={6} />
      </StyledScrollView>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const getScrollViewContentContainerStyle = (
  theme: AppThemeType,
  keyboardHeight: number
): StyleProp<ViewStyle> => ({
  flexGrow: 1,
  flexDirection: 'column',
  paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
  backgroundColor: theme.colors.white,
  alignItems: 'center',
})

const ButtonContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
  alignItems: 'center',
  width: '100%',
}))

const StyledScrollView = styled(ScrollView)({
  paddingHorizontal: getSpacing(5.5),
})
