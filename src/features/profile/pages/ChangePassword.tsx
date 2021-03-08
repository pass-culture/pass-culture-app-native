import { t } from '@lingui/macro'
import React, { useEffect, useRef, useState } from 'react'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { useChangePasswordMutation } from 'features/auth/mutations'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'
import { ProfileContainer } from '../components/reusables'

export function ChangePassword() {
  const { showSuccessSnackBar } = useSnackBarContext()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [hasError, setHasError] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [shouldDisplayPasswordRules, setShouldDisplayPasswordRules] = useState(false)

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
        message: _(t`Mot de passe modifié`),
        timeout: SNACK_BAR_TIME_OUT,
      })
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

  return (
    <React.Fragment>
      <ProfileHeaderWithNavigation title={_(t`Mot de passe`)} />
      <Container>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={getScrollViewContentContainerStyle(keyboardHeight)}>
          <StyledInput>
            <Typo.Body>{_(t`Mot de passe actuel`)}</Typo.Body>
            <Spacer.Column numberOfSpaces={2} />
            <PasswordInput
              value={currentPassword}
              autoFocus={true}
              onChangeText={setCurrentPassword}
              placeholder={_(/*i18n: password placeholder */ t`Ton mot de passe actuel`)}
            />
            <Spacer.Column numberOfSpaces={2} />
            <InputError
              visible={hasError}
              messageId="Mot de passe incorrect"
              numberOfSpacesTop={0}
            />
          </StyledInput>
          <Spacer.Column numberOfSpaces={5} />
          <StyledInput>
            <Typo.Body>{_(t`Nouveau mot de passe`)}</Typo.Body>
            <Spacer.Column numberOfSpaces={2} />
            <PasswordInput
              value={newPassword}
              onChangeText={updateNewPassword}
              placeholder={_(/*i18n: password placeholder */ t`Ton nouveau mot de passe`)}
            />
            {shouldDisplayPasswordRules && newPassword.length > 0 && (
              <PasswordSecurityRules password={newPassword} />
            )}
          </StyledInput>
          <Spacer.Column numberOfSpaces={5} />
          <StyledInput>
            <Typo.Body>{_(t`Confirmer le mot de passe`)}</Typo.Body>
            <Spacer.Column numberOfSpaces={2} />
            <PasswordInput
              value={confirmedPassword}
              onChangeText={setConfirmedPassword}
              placeholder={_(/*i18n: password placeholder */ t`Confirmer le mot de passe`)}
              onFocus={() => {
                setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 60)
              }}
            />
          </StyledInput>
          <Spacer.Column numberOfSpaces={2} />
          <InputError
            visible={displayNotMatchingError}
            messageId="les mots de passe ne concordent pas"
            numberOfSpacesTop={0}
          />
          <Spacer.Flex flex={1} />
          {Boolean(keyboardHeight) && <Spacer.Column numberOfSpaces={2} />}
          <ButtonContainer paddingBottom={keyboardHeight ? 0 : bottom}>
            <ButtonPrimary
              title={_(t`Enregistrer`)}
              onPress={submitPassword}
              disabled={!shouldSave || isLoading}
            />
          </ButtonContainer>
        </ScrollView>
      </Container>
    </React.Fragment>
  )
}

const getScrollViewContentContainerStyle = (keyboardHeight: number): StyleProp<ViewStyle> => ({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
})

const StyledInput = styled.View({
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
const ButtonContainer = styled.View<{ paddingBottom: number }>({
  flexDirection: 'row',
  alignSelf: 'flex-end',
})

const Container = styled(ProfileContainer)({
  padding: getSpacing(4),
})
