import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { useSignIn } from 'features/auth/api'
import { NavigateToHomeWithoutModalOptions, usePreviousRoute } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

let INITIAL_IDENTIFIER = ''
let INITIAL_PASSWORD = ''

if (__DEV__) {
  INITIAL_IDENTIFIER = env.SIGNIN_IDENTIFIER
  INITIAL_PASSWORD = env.SIGNIN_PASSWORD
}

export const Login: FunctionComponent = function () {
  const [email, setEmail] = useState(INITIAL_IDENTIFIER)
  const [password, setPassword] = useState(INITIAL_PASSWORD)
  const [shouldShowErrorMessage, setShouldShowErrorMessage] = useState(false)
  const signIn = useSignIn()

  const shouldDisableLoginButton = isValueEmpty(email) || isValueEmpty(password)

  const { goBack, navigate } = useNavigation<UseNavigationType>()
  const previousRoute = usePreviousRoute()

  async function handleSignin() {
    Keyboard.dismiss()
    setShouldShowErrorMessage(false)
    const signinResponse = await signIn({ identifier: email, password })

    if (signinResponse.isSuccess) {
      navigate('Home', NavigateToHomeWithoutModalOptions)
    } else {
      const { code } = signinResponse.content || {}
      if (code === 'EMAIL_NOT_VALIDATED') {
        navigate('SignupConfirmationEmailSent', { email })
      }
      setShouldShowErrorMessage(true)
    }
  }

  function onBackNavigation() {
    if (previousRoute?.name == 'ReinitializePassword') {
      goBack()
    } else {
      navigate('Home', { shouldDisplayLoginModal: true })
    }
  }

  function onClose() {
    navigate('Home', NavigateToHomeWithoutModalOptions)
  }

  function onForgottenPasswordClick() {
    navigate('ForgottenPassword')
  }

  return (
    <BottomContentPage>
      <ModalHeader
        title={_(t`Connecte-toi !`)}
        leftIcon={ArrowPrevious}
        onLeftIconPress={onBackNavigation}
        rightIcon={Close}
        onRightIconPress={onClose}
      />
      <InputError
        visible={shouldShowErrorMessage}
        messageId="E-mail ou mot de passe incorrect"
        numberOfSpacesTop={5}
      />
      <Spacer.Column numberOfSpaces={7} />
      <StyledInput>
        <Typo.Body>{_(t`Adresse e-mail`)}</Typo.Body>
        <Spacer.Column numberOfSpaces={2} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={_(/*i18n: email placeholder */ t`tonadresse@email.com`)}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          isError={shouldShowErrorMessage}
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
          textContentType="password"
        />
      </StyledInput>
      <Spacer.Column numberOfSpaces={7} />
      <ForgottenPasswordContainer>
        <TouchableOpacity onPress={onForgottenPasswordClick}>
          <Typo.ButtonText>{_(t`Mot de passe oublié ?`)}</Typo.ButtonText>
        </TouchableOpacity>
      </ForgottenPasswordContainer>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimary
        title={_(t`Se connecter`)}
        onPress={handleSignin}
        disabled={shouldDisableLoginButton}
      />
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

const ForgottenPasswordContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  width: '100%',
  maxWidth: getSpacing(125),
})
