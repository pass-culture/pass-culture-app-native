import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { BottomCard } from 'ui/components/BottomCard'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SafeContainer } from 'ui/components/SafeContainer'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { signin } from '../api'

type Props = StackScreenProps<RootStackParamList, 'Login'>

let INITIAL_IDENTIFIER = ''
let INITIAL_PASSWORD = ''

if (__DEV__) {
  INITIAL_IDENTIFIER = env.SIGNIN_IDENTIFIER
  INITIAL_PASSWORD = env.SIGNIN_PASSWORD
}

export const Login: FunctionComponent<Props> = function (props: Props) {
  const [email, setEmail] = useState(INITIAL_IDENTIFIER)
  const [password, setPassword] = useState(INITIAL_PASSWORD)
  const [shouldShowErrorMessage, setShouldShowErrorMessage] = useState(false)

  const shouldDisableLoginButton = isValueEmpty(email) || isValueEmpty(password)

  async function handleSignin() {
    setShouldShowErrorMessage(false)
    const isSigninSuccessful = await signin({ email, password })
    if (isSigninSuccessful) {
      props.navigation.navigate('Home', { shouldDisplayLoginModal: false })
    } else {
      setShouldShowErrorMessage(true)
    }
  }

  function onBackNavigation() {
    props.navigation.navigate('Home', { shouldDisplayLoginModal: true })
  }

  function onClose() {
    props.navigation.navigate('Home', { shouldDisplayLoginModal: false })
  }

  function onForgottenPasswordClick() {
    Alert.alert('TO DO')
  }

  return (
    <SafeContainer>
      <BottomCard>
        <ModalHeader
          title={_(t`Connecte-toi !`)}
          leftIcon={ArrowPrevious}
          onLeftIconPress={onBackNavigation}
          rightIcon={Close}
          onRightIconPress={onClose}
        />
        {shouldShowErrorMessage && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={5} />
            <StyledInline>
              <Warning size={24} />
              <Typo.Caption color={ColorsEnum.ERROR}>
                {_(t`E-mail ou mot de passe incorrect`)}
              </Typo.Caption>
            </StyledInline>
          </React.Fragment>
        )}
        <Spacer.Column numberOfSpaces={7} />
        <StyledInput>
          <Typo.Body>{_(t`Adresse e-mail`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={_(/*i18n: email placeholder */ t`tonadresse@email.com`)}
            keyboardType="email-address"
            autoFocus={true}
            isError={shouldShowErrorMessage}
            width="100%"
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={6} />
        <StyledInput>
          <Typo.Body>{_(t`Mot de passe`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder={_(/*i18n: password placeholder */ t`Ton mot de passe`)}
            isError={shouldShowErrorMessage}
            width="100%"
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={7} />
        <StyledForgottenPasswordTouchableOpacity onPress={onForgottenPasswordClick}>
          <Typo.ButtonText>{_(t`Mot de passe oublié ?`)}</Typo.ButtonText>
        </StyledForgottenPasswordTouchableOpacity>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary
          title={_(t`Se connecter`)}
          onPress={handleSignin}
          disabled={shouldDisableLoginButton}
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

const StyledInline = styled.View({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  maxWidth: getSpacing(125),
})

const StyledForgottenPasswordTouchableOpacity = styled.TouchableOpacity({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  width: '100%',
  maxWidth: getSpacing(125),
})
