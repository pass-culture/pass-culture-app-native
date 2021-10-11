import { t } from '@lingui/macro'
import { LoadingPage } from '@pass-culture/id-check/src/ui/components/loaders/LoadingPage'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { isTimestampExpired } from 'libs/dates'
import { BottomCardContentContainer } from 'ui/components/BottomCardContentContainer'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useResetPasswordMutation } from '../../mutations'

export const ReinitializePassword = () => {
  const route = useRoute<UseRouteType<'ReinitializePassword'>>()
  const navigation = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar } = useSnackBarContext()

  const [isTimestampExpirationVerified, setIsTimestampExpirationVerified] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')

  const allowSubmission = isPasswordCorrect(password) && confirmedPassword === password
  const displayNotMatchingError = confirmedPassword.length > 0 && confirmedPassword !== password

  useFocusEffect(
    useCallback(() => {
      setIsTimestampExpirationVerified(false)
      const { expiration_timestamp, email } = route.params
      if (isTimestampExpired(expiration_timestamp)) {
        navigation.replace('ResetPasswordExpiredLink', { email })
      } else {
        setIsTimestampExpirationVerified(true)
      }
    }, [route.params])
  )

  const { mutate: resetPassword, isLoading } = useResetPasswordMutation(() => {
    showSuccessSnackBar({
      message: t`Ton mot de passe a été modifié !`,
      timeout: SNACK_BAR_TIME_OUT,
    })
    analytics.logHasChangedPassword('resetPassword')
    navigation.navigate('Login')
  })

  function submitPassword() {
    if (allowSubmission) {
      resetPassword({
        newPassword: password,
        resetPasswordToken: route.params.token,
      })
    }
  }

  if (!isTimestampExpirationVerified) {
    return <LoadingPage />
  }
  return (
    <BottomContentPage>
      <ModalHeader
        title={t`Ton mot de passe`}
        leftIconAccessibilityLabel={undefined}
        leftIcon={undefined}
        onLeftIconPress={undefined}
        rightIconAccessibilityLabel={t`Revenir à l'accueil`}
        rightIcon={Close}
        onRightIconPress={navigateToHome}
      />
      <BottomCardContentContainer>
        <Spacer.Column numberOfSpaces={6} />
        <StyledInput>
          <Typo.Body>{t`Nouveau mot de passe`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={password}
            autoFocus
            onChangeText={setPassword}
            placeholder={t`Ton mot de passe`}
            onSubmitEditing={submitPassword}
          />
        </StyledInput>
        <PasswordSecurityRules password={password} />
        <Spacer.Column numberOfSpaces={6} />
        <StyledInput>
          <Typo.Body>{t`Confirmer le mot de passe`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={confirmedPassword}
            onChangeText={setConfirmedPassword}
            placeholder={t`Confirmer le mot de passe`}
            onSubmitEditing={submitPassword}
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={2} />
        <InputError
          visible={displayNotMatchingError}
          messageId={t`les mots de passe ne concordent pas`}
          numberOfSpacesTop={0}
        />
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          title={t`Continuer`}
          onPress={submitPassword}
          disabled={!allowSubmission}
          isLoading={isLoading}
        />
      </BottomCardContentContainer>
    </BottomContentPage>
  )
}

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
