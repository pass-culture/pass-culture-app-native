import { useNavigation } from '@react-navigation/native'
import { Formik, useFormikContext } from 'formik'
import { FormikHelpers } from 'formik/dist/types'
import React, { useRef, useState } from 'react'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'
import { object, string, ref } from 'yup'

import { ApiError } from 'api/apiHelpers'
import {
  PasswordSecurityRules,
  PASSWORD_MIN_LENGTH,
  CAPITAL_REGEX,
  LOWERCASE_REGEX,
  NUMBER_REGEX,
  SPECIAL_CHARACTER_REGEX,
} from 'features/auth/components/PasswordSecurityRules'
import { useChangePasswordMutation } from 'features/auth/mutations'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/firebase/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { theme } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { getSpacing, Spacer } from 'ui/theme'

const SubmitButton = () => {
  const { dirty, isValid, isValidating, isSubmitting, handleSubmit } = useFormikContext()
  const disabled = !dirty || !isValid || (!isValidating && isSubmitting)
  useEnterKeyAction(!disabled ? () => handleSubmit() : undefined)

  return (
    <ButtonPrimary
      wording={'Enregistrer'}
      accessibilityLabel={'Enregistrer les modifications'}
      onPress={handleSubmit}
      disabled={disabled}
    />
  )
}

type ChangePasswordFormFields = {
  currentPassword: string
  newPassword: string
  confirmedPassword: string
}

const ChangePasswordSchema = object().shape({
  currentPassword: string()
    .min(PASSWORD_MIN_LENGTH)
    .required()
    .matches(CAPITAL_REGEX, '1 Majuscule')
    .matches(LOWERCASE_REGEX, '1 Minuscule')
    .matches(NUMBER_REGEX, '1 Chiffre')
    .matches(SPECIAL_CHARACTER_REGEX, '1 Caractère spécial (!@#$%^&*...)'),
  newPassword: string()
    .min(PASSWORD_MIN_LENGTH)
    .required('required')
    .matches(CAPITAL_REGEX, '1 Majuscule')
    .matches(LOWERCASE_REGEX, '1 Minuscule')
    .matches(NUMBER_REGEX, '1 Chiffre')
    .matches(SPECIAL_CHARACTER_REGEX, '1 Caractère spécial (!@#$%^&*...)'),
  confirmedPassword: string()
    .oneOf([ref('newPassword'), null], 'Les mots de passe ne concordent pas')
    .required(),
})

const passwordDescribedBy = uuidv4()
const passwordInputErrorId = uuidv4()
const passwordConfirmationErrorId = uuidv4()

export function ChangePassword() {
  const initialValues: ChangePasswordFormFields = {
    currentPassword: '',
    newPassword: '',
    confirmedPassword: '',
  }
  const { isMobileViewport, isTouch } = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar } = useSnackBarContext()
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useForHeightKeyboardEvents(setKeyboardHeight)

  const { mutate: changePassword } = useChangePasswordMutation()

  function submitPassword(
    values: ChangePasswordFormFields,
    { setErrors, resetForm }: FormikHelpers<ChangePasswordFormFields>
  ) {
    // returning a promise will allow formik to set isSubmitting to false afterward
    return new Promise<void>((resolve) => {
      changePassword(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          onSuccess() {
            resetForm()
            showSuccessSnackBar({
              message: 'Ton mot de passe est modifié',
              timeout: SNACK_BAR_TIME_OUT,
            })
            navigate(...getTabNavConfig('Profile'))
            analytics.logHasChangedPassword('changePassword')
            resolve()
          },
          onError(error, { newPassword }) {
            setErrors({
              currentPassword: 'Mot de passe incorrect',
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
  }

  const scrollRef = useRef<ScrollView | null>(null)
  const { bottom } = useSafeAreaInsets()

  return (
    <Container>
      <PageHeader title={'Mot de passe'} background="primary" withGoBackButton />
      <StyledScrollView
        ref={scrollRef}
        contentContainerStyle={getScrollViewContentContainerStyle(keyboardHeight)}
        keyboardShouldPersistTaps="handled">
        <Spacer.Column numberOfSpaces={8} />
        <Formik
          initialValues={initialValues}
          validationSchema={ChangePasswordSchema}
          onSubmit={submitPassword}>
          {({ handleChange, handleBlur, values, errors, setFieldError }) => (
            <Form.MaxWidth flex={1}>
              <PasswordInput
                label={'Mot de passe actuel'}
                value={values.currentPassword}
                onChangeText={(values) => {
                  handleChange('currentPassword')(values)
                  setFieldError('currentPassword', undefined)
                }}
                onBlur={handleBlur('currentPassword')}
                placeholder={'Ton mot de passe actuel'}
                isRequiredField
                accessibilityDescribedBy={passwordInputErrorId}
                isError={!!errors.currentPassword}
              />
              <InputError
                visible={!!errors.currentPassword}
                messageId={'Mot de passe incorrect'}
                numberOfSpacesTop={getSpacing(0.5)}
                relatedInputId={passwordInputErrorId}
              />
              <Spacer.Column numberOfSpaces={7} />
              <PasswordInput
                label={'Nouveau mot de passe'}
                accessibilityDescribedBy={passwordDescribedBy}
                value={values.newPassword}
                onChangeText={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
                placeholder={'Ton nouveau mot de passe'}
                isRequiredField
                isError={
                  !!errors.newPassword &&
                  errors.newPassword !== 'required' &&
                  values.newPassword.length > 0
                }
              />
              <PasswordSecurityRules
                password={values.newPassword}
                visible={values.newPassword.length > 0}
                nativeID={passwordDescribedBy}
              />
              <Spacer.Column numberOfSpaces={5} />
              <PasswordInput
                label={'Confirmer le mot de passe'}
                value={values.confirmedPassword}
                onChangeText={handleChange('confirmedPassword')}
                onBlur={handleBlur('confirmedPassword')}
                placeholder={'Confirmer le mot de passe'}
                onFocus={() => {
                  setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 60)
                }}
                isRequiredField
                accessibilityDescribedBy={passwordConfirmationErrorId}
                isError={
                  !!errors.confirmedPassword &&
                  values.newPassword.length > 0 &&
                  values.confirmedPassword.length > 0
                }
              />
              <InputError
                visible={
                  !!errors.confirmedPassword &&
                  values.newPassword.length > 0 &&
                  values.confirmedPassword.length > 0
                }
                messageId={'Les mots de passe ne concordent pas'}
                numberOfSpacesTop={getSpacing(0.5)}
                relatedInputId={passwordConfirmationErrorId}
              />

              {isMobileViewport && isTouch ? (
                <Spacer.Flex flex={1} />
              ) : (
                <Spacer.Column numberOfSpaces={10} />
              )}

              {!!keyboardHeight && <Spacer.Column numberOfSpaces={2} />}
              <ButtonContainer paddingBottom={keyboardHeight ? 0 : bottom}>
                <SubmitButton />
              </ButtonContainer>
            </Form.MaxWidth>
          )}
        </Formik>
        <Spacer.Column numberOfSpaces={6} />
      </StyledScrollView>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const getScrollViewContentContainerStyle = (keyboardHeight: number): StyleProp<ViewStyle> => ({
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
