import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import {
  navigateToHomeWithoutModal,
  UseRouteType,
  UseNavigationType,
} from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BottomCard, BottomCardContentContainer } from 'ui/components/BottomCard'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SnackBarContext, SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { Background } from 'ui/svg/Background'
import { Close } from 'ui/svg/icons/Close'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useResetPasswordMutation } from '../api'

const MILLISECONDS_IN_A_SECOND = 1000

export const ReinitializePassword = () => {
  const { params } = useRoute<UseRouteType<'ReinitializePassword'>>()
  const navigation = useNavigation<UseNavigationType>()

  const { displaySuccessSnackBar } = useContext(SnackBarContext)

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
    navigation.navigate('Login')
  })

  function submitPassword() {
    resetPassword({
      new_password: password,
      reset_password_token: params.token,
    })
  }

  useEffect(() => {
    if (params.expiration_timestamp * MILLISECONDS_IN_A_SECOND < new Date().getTime()) {
      navigation.navigate('Login')
    }
  }, [])

  return (
    <React.Fragment>
      <Background />
      <BottomCard>
        <ModalHeader
          title={_(t`Ton mot de passe`)}
          rightIcon={Close}
          onRightIconPress={navigateToHomeWithoutModal}
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
          {displayNotMatchingError && (
            <ErrorLineContainer>
              <Warning size={24} color={ColorsEnum.ERROR} />
              <Typo.Caption testID="not-matching-error" color={ColorsEnum.ERROR}>
                {_(t`les mots de passe ne concordent pas`)}
              </Typo.Caption>
            </ErrorLineContainer>
          )}
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            title={_(t`Continuer`)}
            onPress={submitPassword}
            disabled={!allowSubmission}
            isLoading={isLoading}
          />
        </BottomCardContentContainer>
      </BottomCard>
    </React.Fragment>
  )
}

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})

const ErrorLineContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
})
