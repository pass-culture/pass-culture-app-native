import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { Alert, Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Background } from 'ui/svg/Background'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum, getShadow, getSpacing, Spacer, Typo } from 'ui/theme'

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Background />
      <StyledFakeModal>
        <StyledForm>
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
          <StyledSigninButton>
            <ButtonPrimary title={_(t`Se connecter`)} onPress={handleSignin} />
          </StyledSigninButton>
        </StyledForm>
      </StyledFakeModal>
    </TouchableWithoutFeedback>
  )
}

const StyledFakeModal = styled.View({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  padding: getSpacing(6),
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
  backgroundColor: `${ColorsEnum.WHITE}`,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(2),
    },
    shadowRadius: getSpacing(1),
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.15,
  }),
})

const StyledForm = styled.View({
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: getSpacing(125),
})

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
})

const StyledInline = styled.View({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
})

const StyledSigninButton = styled.View({
  width: '100%',
})

const StyledForgottenPasswordTouchableOpacity = styled.TouchableOpacity({
  alignSelf: 'flex-end',
})
