import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, memo } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { useSignIn, SignInResponseFailure } from 'features/auth/api'
import { shouldShowCulturalSurvey } from 'features/firstLogin/helpers'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { env } from 'libs/environment'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Key } from 'ui/svg/icons/Key'
import { getSpacing, Spacer } from 'ui/theme'

let INITIAL_IDENTIFIER = ''
let INITIAL_PASSWORD = ''

if (__DEV__) {
  INITIAL_IDENTIFIER = env.SIGNIN_IDENTIFIER
  INITIAL_PASSWORD = env.SIGNIN_PASSWORD
}

type Props = {
  doNotNavigateOnSigninSuccess?: boolean
}

export const Login: FunctionComponent<Props> = memo(function Login(props) {
  const [email, setEmail] = useSafeState(INITIAL_IDENTIFIER)
  const [password, setPassword] = useSafeState(INITIAL_PASSWORD)
  const [isLoading, setIsLoading] = useSafeState(false)
  const [errorMessage, setErrorMessage] = useSafeState<string | null>(null)
  const [hasEmailError, setHasEmailError] = useSafeState(false)
  const signIn = useSignIn()
  const shouldDisableLoginButton = isValueEmpty(email) || isValueEmpty(password) || isLoading

  const { params } = useRoute<UseRouteType<'Login'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavConfig)

  function onEmailChange(email: string) {
    if (hasEmailError) {
      setIsLoading(false)
      setHasEmailError(false)
    }
    setEmail(email)
  }

  async function handleSignin() {
    setIsLoading(true)
    setErrorMessage(null)
    if (!isEmailValid(email)) {
      setHasEmailError(true)
    } else {
      const signinResponse = await signIn({ identifier: email, password })
      if (signinResponse.isSuccess) {
        handleSigninSuccess()
      } else {
        handleSigninFailure(signinResponse)
      }
    }
  }

  async function handleSigninSuccess() {
    try {
      if (props.doNotNavigateOnSigninSuccess) {
        return
      }
      const user = await api.getnativev1me()
      const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))

      if (user?.recreditAmountToShow) {
        navigate('RecreditBirthdayNotification')
      } else if (!hasSeenEligibleCard && user.showEligibleCard) {
        navigate('EighteenBirthday')
      } else if (shouldShowCulturalSurvey(user)) {
        navigate('CulturalSurvey')
      } else {
        navigateToHome()
      }
    } catch {
      setErrorMessage(t`Il y a eu un problème. Tu peux réessayer plus tard`)
    }
  }

  function handleSigninFailure(response: SignInResponseFailure) {
    const failureCode = response.content?.code
    if (failureCode === 'EMAIL_NOT_VALIDATED') {
      navigate('SignupConfirmationEmailSent', { email })
    } else if (failureCode === 'NETWORK_REQUEST_FAILED') {
      setIsLoading(false)
      setErrorMessage(t`Erreur réseau. Tu peux réessayer une fois la connexion réétablie`)
    } else if (response.statusCode === 429 || failureCode === 'TOO_MANY_ATTEMPTS') {
      setIsLoading(false)
      setErrorMessage(t`Nombre de tentatives dépassé. Réessaye dans 1 minute`)
    } else {
      setIsLoading(false)
      setErrorMessage(t`E-mail ou mot de passe incorrect`)
    }
  }

  async function onSubmit() {
    if (!shouldDisableLoginButton) {
      Keyboard.dismiss()
      handleSignin()
    }
  }

  function onClose() {
    navigateToHome()
  }

  function onForgottenPasswordClick() {
    navigate('ForgottenPassword')
  }

  const rightIconProps = params?.preventCancellation
    ? {
        rightIconAccessibilityLabel: undefined,
        rightIcon: undefined,
        onRightIconPress: undefined,
      }
    : {
        rightIconAccessibilityLabel: t`Revenir à l'accueil`,
        rightIcon: Close,
        onRightIconPress: onClose,
      }
  return (
    <BottomContentPage>
      <ModalHeader
        title={t`Connecte-toi\u00a0!`}
        leftIconAccessibilityLabel={t`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        {...rightIconProps}
      />
      {!!errorMessage && (
        <InputError visible messageId={errorMessage} numberOfSpacesTop={5} centered />
      )}
      <Spacer.Column numberOfSpaces={7} />
      <EmailInput
        label={t`Adresse e-mail`}
        email={email}
        onEmailChange={onEmailChange}
        isError={hasEmailError || !!errorMessage}
        isRequiredField
      />
      <InputError
        visible={hasEmailError}
        messageId={t`L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr`}
        numberOfSpacesTop={2}
      />
      <Spacer.Column numberOfSpaces={6} />
      <PasswordInput
        label={t`Mot de passe`}
        value={password}
        onChangeText={setPassword}
        placeholder={t`Ton mot de passe`}
        isError={!!errorMessage}
        textContentType="password"
        onSubmitEditing={onSubmit}
        isRequiredField
      />
      <Spacer.Column numberOfSpaces={7} />
      <ForgottenPasswordContainer>
        <ButtonTertiaryBlack
          wording={t`Mot de passe oublié\u00a0?`}
          onPress={onForgottenPasswordClick}
          icon={Key}
          inline
        />
      </ForgottenPasswordContainer>

      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimary
        wording={t`Se connecter`}
        onPress={onSubmit}
        disabled={shouldDisableLoginButton}
      />
    </BottomContentPage>
  )
})

const ForgottenPasswordContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  width: '100%',
  maxWidth: getSpacing(125),
})
