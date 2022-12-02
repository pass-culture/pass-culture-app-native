import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ApiError } from 'api/apiHelpers'
import { PasswordSecurityRules } from 'features/auth/components/PasswordSecurityRules'
import { useChangePasswordMutation } from 'features/auth/mutations'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { changePasswordSchema } from 'features/profile/pages/ChangePassword/schema/changePasswordSchema'
import { analytics } from 'libs/firebase/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { AppThemeType } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { getSpacing, Spacer } from 'ui/theme'

type ChangePasswordFormData = {
  currentPassword: string
  newPassword: string
  confirmedPassword: string
}

const passwordDescribedBy = uuidv4()
const passwordInputErrorId = uuidv4()
const passwordConfirmationErrorId = uuidv4()

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
    getValues,
    formState: { errors, isSubmitting, isValid, isValidating, isDirty },
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
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <React.Fragment>
                <PasswordInput
                  label="Mot de passe actuel"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ton mot de passe actuel"
                  isRequiredField
                  accessibilityDescribedBy={passwordInputErrorId}
                  isError={error && value.length > 0}
                />
                <InputError
                  visible={!!error && value.length > 0}
                  messageId="Mot de passe incorrect"
                  numberOfSpacesTop={getSpacing(0.5)}
                  relatedInputId={passwordInputErrorId}
                />
              </React.Fragment>
            )}
          />
          <Spacer.Column numberOfSpaces={7} />
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <React.Fragment>
                <PasswordInput
                  label="Nouveau mot de passe"
                  accessibilityDescribedBy={passwordDescribedBy}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ton nouveau mot de passe"
                  isRequiredField
                  isError={error && value.length > 0}
                />
                <PasswordSecurityRules
                  password={value}
                  visible={value.length > 0}
                  nativeID={passwordDescribedBy}
                />
              </React.Fragment>
            )}
          />
          <Spacer.Column numberOfSpaces={5} />
          <Controller
            control={control}
            name="confirmedPassword"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <React.Fragment>
                <PasswordInput
                  label="Confirmer le mot de passe"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Confirmer le mot de passe"
                  onFocus={onFocusConfirmedPassword}
                  isRequiredField
                  accessibilityDescribedBy={passwordConfirmationErrorId}
                  isError={
                    !!errors.confirmedPassword &&
                    getValues('newPassword').length > 0 &&
                    value.length > 0
                  }
                />
                <InputError
                  visible={!!error && getValues('newPassword').length > 0 && value.length > 0}
                  messageId={error?.message}
                  numberOfSpacesTop={getSpacing(0.5)}
                  relatedInputId={passwordConfirmationErrorId}
                />
              </React.Fragment>
            )}
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
