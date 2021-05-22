import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { useSignIn, SignInResponseFailure } from 'features/auth/api'
import { useBackNavigation } from 'features/navigation/backNavigation'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'
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
  const [email, setEmail] = useSafeState(INITIAL_IDENTIFIER)
  const [password, setPassword] = useSafeState(INITIAL_PASSWORD)
  const [isLoading, setIsLoading] = useSafeState(false)
  const [errorMessage, setErrorMessage] = useSafeState<string | null>(null)
  const signIn = useSignIn()

  const shouldDisableLoginButton = isValueEmpty(email) || isValueEmpty(password) || isLoading

  const { params } = useRoute<UseRouteType<'Login'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const complexGoBack = useBackNavigation()

  async function handleSignin() {
    setIsLoading(true)
    setErrorMessage(null)
    const signinResponse = await signIn({ identifier: email, password })
    if (signinResponse.isSuccess) {
      handleSigninSuccess()
    } else {
      handleSigninFailure(signinResponse)
    }
  }
  async function handleSigninSuccess() {
    try {
      const user = await api.getnativev1me()
      const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))

      if (!hasSeenEligibleCard && user.showEligibleCard) {
        navigate('EighteenBirthday')
      } else if (user.isBeneficiary && user.needsToFillCulturalSurvey) {
        navigate('CulturalSurvey')
      } else {
        navigateToHome()
      }
    } catch {
      setErrorMessage(t`Il y a eu un problème. Tu peux réessayer plus tard.`)
    }
  }
  function handleSigninFailure(response: SignInResponseFailure) {
    const failureCode = response.content?.code
    if (failureCode === 'EMAIL_NOT_VALIDATED') {
      navigate('SignupConfirmationEmailSent', { email })
    } else if (failureCode === 'NETWORK_REQUEST_FAILED') {
      setIsLoading(false)
      setErrorMessage(t`Erreur réseau. Tu peux réessayer une fois la connexion réétablie.`)
    } else if (response.statusCode === 429) {
      setIsLoading(false)
      setErrorMessage(t`Nombre de tentatives dépassé. Réessaye dans 1 minute.`)
    } else {
      setIsLoading(false)
      setErrorMessage(t`E-mail ou mot de passe incorrect.`)
    }
  }

  async function onSubmit() {
    Keyboard.dismiss()
    handleSignin()
  }

  function onClose() {
    navigateToHome()
  }

  function onForgottenPasswordClick() {
    navigate('ForgottenPassword')
  }

  return (
    <BottomContentPage>
      <ModalHeader
        title={t`Connecte-toi !`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={complexGoBack}
        rightIcon={params?.preventCancellation ? undefined : Close}
        onRightIconPress={onClose}
      />
      {!!errorMessage && <InputError visible messageId={errorMessage} numberOfSpacesTop={5} />}
      <Spacer.Column numberOfSpaces={7} />
      <StyledInput>
        <Typo.Body>{t`Adresse e-mail`}</Typo.Body>
        <Spacer.Column numberOfSpaces={2} />
        <TextInput
          autoCapitalize="none"
          isError={!!errorMessage}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder={t`tonadresse@email.com`}
          textContentType="emailAddress"
          value={email}
        />
      </StyledInput>
      <Spacer.Column numberOfSpaces={6} />
      <StyledInput>
        <Typo.Body>{t`Mot de passe`}</Typo.Body>
        <Spacer.Column numberOfSpaces={2} />
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder={t`Ton mot de passe`}
          isError={!!errorMessage}
          textContentType="password"
        />
      </StyledInput>
      <Spacer.Column numberOfSpaces={7} />
      <ForgottenPasswordContainer>
        <TouchableOpacity onPress={onForgottenPasswordClick}>
          <Typo.ButtonText>{t`Mot de passe oublié ?`}</Typo.ButtonText>
        </TouchableOpacity>
      </ForgottenPasswordContainer>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimary
        title={t`Se connecter`}
        onPress={onSubmit}
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
