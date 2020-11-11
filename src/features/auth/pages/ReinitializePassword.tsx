import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BottomCard } from 'ui/components/BottomCard'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SafeContainer } from 'ui/components/SafeContainer'
import { Close } from 'ui/svg/icons/Close'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const MILLISECONDS_IN_A_SECOND = 1000

export const ReinitializePassword = () => {
  const {
    params: { expiration_date },
  } = useRoute<UseRouteType<'ReinitializePassword'>>()
  const navigation = useNavigation<UseNavigationType>()

  const [password, setPassword] = useState('')
  const [shouldShowPasswordError] = useState(false)
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [shouldShowConfirmationError] = useState(false)

  const arePasswordsMatching = confirmedPassword === password
  const allowSubmission = password.length > 0 && arePasswordsMatching

  function onClose() {
    navigation.navigate('Home', { shouldDisplayLoginModal: false })
  }
  function submitPassword() {
    // TODO: call submit function using the 'token' params
  }

  useEffect(() => {
    if (expiration_date * MILLISECONDS_IN_A_SECOND < new Date().getTime()) {
      navigation.navigate('Login')
    }
  }, [])

  return (
    <SafeContainer>
      <BottomCard>
        <ModalHeader title={_(t`Ton mot de passe`)} rightIcon={Close} onRightIconPress={onClose} />
        <Spacer.Column numberOfSpaces={6} />
        <StyledInput>
          <Typo.Body>{_(t`Nouveau mot de passe`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder={_(/*i18n: password placeholder */ t`Ton mot de passe`)}
            isError={shouldShowPasswordError}
            width="100%"
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={6} />
        <StyledInput>
          <Typo.Body>{_(t`Confirmer le mot de passe`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={confirmedPassword}
            onChangeText={setConfirmedPassword}
            placeholder={_(/*i18n: password placeholder */ t`Ton mot de passe`)}
            isError={shouldShowConfirmationError}
            width="100%"
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={2} />
        {!arePasswordsMatching && (
          <ErrorLineContainer>
            <Warning size={24} color={ColorsEnum.ERROR} />
            <Typo.Caption color={ColorsEnum.ERROR}>
              {_(t`les mots de passe ne concordent pas`)}
            </Typo.Caption>
          </ErrorLineContainer>
        )}
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          title={_(t`Continuer`)}
          onPress={submitPassword}
          disabled={!allowSubmission}
        />
      </BottomCard>
    </SafeContainer>
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
