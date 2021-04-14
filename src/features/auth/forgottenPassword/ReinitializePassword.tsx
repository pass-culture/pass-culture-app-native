import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { NavigateToHomeWithoutModalOptions } from 'features/navigation/helpers'
import { UseRouteType, UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { BottomCardContentContainer } from 'ui/components/BottomCardContentContainer'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useResetPasswordMutation } from '../mutations'

const MILLISECONDS_IN_A_SECOND = 1000

export const ReinitializePassword = () => {
  const { params } = useRoute<UseRouteType<'ReinitializePassword'>>()
  const { navigate } = useNavigation<UseNavigationType>()

  const { showSuccessSnackBar } = useSnackBarContext()

  const [password, setPassword] = useState('')
  const [shouldShowPasswordError] = useState(false)
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [shouldShowConfirmationError] = useState(false)

  const allowSubmission = isPasswordCorrect(password) && confirmedPassword === password

  const displayNotMatchingError = confirmedPassword.length > 0 && confirmedPassword !== password

  const { mutate: resetPassword, isLoading } = useResetPasswordMutation(() => {
    showSuccessSnackBar({
      message: t`Ton mot de passe a été modifié !`,
      timeout: SNACK_BAR_TIME_OUT,
    })
    analytics.logHasChangedPassword('resetPassword')
    navigate('Login')
  })

  function submitPassword() {
    resetPassword({
      newPassword: password,
      resetPasswordToken: params.token,
    })
  }

  function goToHomeWithoutModal() {
    navigate('Home', NavigateToHomeWithoutModalOptions)
  }

  useEffect(() => {
    if (params.expiration_timestamp * MILLISECONDS_IN_A_SECOND < new Date().getTime()) {
      navigate('Login')
    }
  }, [])

  return (
    <BottomContentPage>
      <ModalHeader
        title={t`Ton mot de passe`}
        rightIcon={Close}
        onRightIconPress={goToHomeWithoutModal}
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
            isError={shouldShowPasswordError}
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
            isError={shouldShowConfirmationError}
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={2} />
        <InputError
          visible={displayNotMatchingError}
          messageId="les mots de passe ne concordent pas"
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
