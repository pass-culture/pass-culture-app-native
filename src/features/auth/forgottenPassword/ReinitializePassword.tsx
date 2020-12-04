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
import { _ } from 'libs/i18n'
import { BottomCardContentContainer } from 'ui/components/BottomCard'
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

  const { displaySuccessSnackBar } = useSnackBarContext()

  const [password, setPassword] = useState('')
  const [shouldShowPasswordError] = useState(false)
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [shouldShowConfirmationError] = useState(false)

  const allowSubmission = isPasswordCorrect(password) && confirmedPassword === password

  const displayNotMatchingError = confirmedPassword.length > 0 && confirmedPassword !== password

  const { mutate: resetPassword, isLoading } = useResetPasswordMutation(() => {
    displaySuccessSnackBar({
      message: _(t`Ton mot de passe a été modifié !`),
      timeout: SNACK_BAR_TIME_OUT,
    })
    navigate('Login')
  })

  function submitPassword() {
    resetPassword({
      new_password: password,
      reset_password_token: params.token,
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
        title={_(t`Ton mot de passe`)}
        rightIcon={Close}
        onRightIconPress={goToHomeWithoutModal}
      />
      <BottomCardContentContainer>
        <Spacer.Column numberOfSpaces={6} />
        <StyledInput>
          <Typo.Body>{_(t`Nouveau mot de passe`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={password}
            autoFocus
            onChangeText={setPassword}
            placeholder={_(/*i18n: password placeholder */ t`Ton mot de passe`)}
            isError={shouldShowPasswordError}
          />
        </StyledInput>
        <PasswordSecurityRules password={password} />
        <Spacer.Column numberOfSpaces={6} />
        <StyledInput>
          <Typo.Body>{_(t`Confirmer le mot de passe`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={confirmedPassword}
            onChangeText={setConfirmedPassword}
            placeholder={_(/*i18n: password placeholder */ t`Confirmer le mot de passe`)}
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
          title={_(t`Continuer`)}
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
