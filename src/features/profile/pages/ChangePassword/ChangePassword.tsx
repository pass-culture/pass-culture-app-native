import { t } from '@lingui/macro'
import React, { useEffect, useRef, useState } from 'react'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { useChangePasswordMutation } from 'features/auth/mutations'
import { analytics } from 'libs/analytics'
import { theme } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { getSpacing, Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export function ChangePassword() {
  const { isMobileViewport, isTouch } = useTheme()
  const { showSuccessSnackBar } = useSnackBarContext()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [hasError, setHasError] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [shouldDisplayPasswordRules, setShouldDisplayPasswordRules] = useState(false)
  const passwordDescribedBy = uuidv4()

  const displayNotMatchingError = confirmedPassword.length > 0 && confirmedPassword !== newPassword

  const shouldSave =
    isPasswordCorrect(currentPassword) &&
    isPasswordCorrect(newPassword) &&
    confirmedPassword === newPassword

  useForHeightKeyboardEvents(setKeyboardHeight)

  // on type, reset error field
  useEffect(() => {
    if (hasError) {
      setHasError(false)
    }
  }, [currentPassword, newPassword, confirmedPassword])

  const { mutate: changePassword, isLoading } = useChangePasswordMutation(
    () => {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmedPassword('')
      setShouldDisplayPasswordRules(false)
      showSuccessSnackBar({
        message: t`Mot de passe modifié`,
        timeout: SNACK_BAR_TIME_OUT,
      })
      analytics.logHasChangedPassword('changePassword')
    },
    () => {
      setHasError(true)
      setShouldDisplayPasswordRules(false)
    }
  )

  function submitPassword() {
    changePassword({ currentPassword, newPassword })
  }

  function updateNewPassword(value: string) {
    if (!shouldDisplayPasswordRules) {
      setShouldDisplayPasswordRules(true)
    }
    setNewPassword(value)
  }

  const scrollRef = useRef<ScrollView | null>(null)

  const { bottom } = useSafeAreaInsets()

  const disabled = !shouldSave || isLoading
  const passwordInputErrorId = uuidv4()
  const passwordConfirmationErrorId = uuidv4()

  useEnterKeyAction(!disabled ? submitPassword : undefined)

  return (
    <Container>
      <PageHeader title={t`Mot de passe`} />
      <Spacer.TopScreen />
      <StyledScrollView
        ref={scrollRef}
        contentContainerStyle={getScrollViewContentContainerStyle(keyboardHeight)}
        keyboardShouldPersistTaps="handled">
        <Spacer.Column numberOfSpaces={20} />
        <Form.MaxWidth>
          <PasswordInput
            label={t`Mot de passe actuel`}
            value={currentPassword}
            autoFocus={true}
            onChangeText={setCurrentPassword}
            placeholder={t`Ton mot de passe actuel`}
            isRequiredField
            accessibilityDescribedBy={passwordInputErrorId}
          />
          <InputError
            visible={hasError}
            messageId={t`Mot de passe incorrect`}
            numberOfSpacesTop={0}
            relatedInputId={passwordInputErrorId}
          />
          <Spacer.Column numberOfSpaces={7} />
          <PasswordInput
            label={t`Nouveau mot de passe`}
            accessibilityDescribedBy={passwordDescribedBy}
            value={newPassword}
            onChangeText={updateNewPassword}
            placeholder={t`Ton nouveau mot de passe`}
            isRequiredField
          />
          {!!(shouldDisplayPasswordRules && newPassword.length > 0) && (
            <PasswordSecurityRules password={newPassword} nativeID={passwordDescribedBy} />
          )}
          <Spacer.Column numberOfSpaces={5} />
          <PasswordInput
            label={t`Confirmer le mot de passe`}
            value={confirmedPassword}
            onChangeText={setConfirmedPassword}
            placeholder={t`Confirmer le mot de passe`}
            onFocus={() => {
              setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 60)
            }}
            isRequiredField
            accessibilityDescribedBy={passwordConfirmationErrorId}
          />
          <InputError
            visible={displayNotMatchingError}
            messageId={t`Les mots de passe ne concordent pas`}
            numberOfSpacesTop={2}
            relatedInputId={passwordConfirmationErrorId}
          />

          {isMobileViewport && isTouch ? (
            <Spacer.Flex flex={1} />
          ) : (
            <Spacer.Column numberOfSpaces={10} />
          )}

          {!!keyboardHeight && <Spacer.Column numberOfSpaces={2} />}
          <ButtonContainer paddingBottom={keyboardHeight ? 0 : bottom}>
            <ButtonPrimary
              wording={t`Enregistrer`}
              accessibilityLabel={t`Enregistrer les modifications`}
              onPress={submitPassword}
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
