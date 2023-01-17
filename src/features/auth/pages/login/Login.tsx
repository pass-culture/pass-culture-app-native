import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, memo, useCallback, useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { api } from 'api/api'
import { AccountState } from 'api/gen'
import { useSignIn } from 'features/auth/api/useSignIn'
import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { SignInResponseFailure } from 'features/auth/types'
import {
  shouldShowCulturalSurvey,
  useCulturalSurveyRoute,
} from 'features/culturalSurvey/helpers/utils'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Form } from 'ui/components/Form'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Key } from 'ui/svg/icons/Key'
import { Spacer } from 'ui/theme'

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
  const [email, setEmail] = useState(INITIAL_IDENTIFIER)
  const [password, setPassword] = useState(INITIAL_PASSWORD)
  const [isLoading, setIsLoading] = useSafeState(false)
  const [errorMessage, setErrorMessage] = useSafeState<string | null>(null)
  const [emailErrorMessage, setEmailErrorMessage] = useSafeState<string | null>(null)
  const signIn = useSignIn()
  const shouldDisableLoginButton = isValueEmpty(email) || isValueEmpty(password) || isLoading
  const emailInputErrorId = uuidv4()
  const culturalSurveyRoute = useCulturalSurveyRoute()
  const { showInfoSnackBar } = useSnackBarContext()

  const { params } = useRoute<UseRouteType<'Login'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavConfig)

  useEffect(() => {
    if (params?.displayForcedLoginHelpMessage) {
      showInfoSnackBar({
        message:
          'Pour sécuriser ton pass Culture, tu dois confirmer tes identifiants tous les 30 jours.',
      })
    }
  }, [params?.displayForcedLoginHelpMessage, showInfoSnackBar])

  const onEmailChange = useCallback(
    (mail: string) => {
      if (emailErrorMessage) {
        setIsLoading(false)
        setEmailErrorMessage(null)
      }
      setEmail(mail)
    },
    [emailErrorMessage, setEmailErrorMessage, setIsLoading]
  )

  const handleSigninSuccess = useCallback(
    async (accountState: AccountState) => {
      try {
        if (props.doNotNavigateOnSigninSuccess) {
          return
        }

        if (accountState !== AccountState.ACTIVE) {
          setIsLoading(false)
          return navigate('SuspensionScreen')
        }

        const user = await api.getnativev1me()
        const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))

        if (user?.recreditAmountToShow) {
          navigate('RecreditBirthdayNotification')
        } else if (!hasSeenEligibleCard && user.showEligibleCard) {
          navigate('EighteenBirthday')
        } else if (shouldShowCulturalSurvey(user)) {
          navigate(culturalSurveyRoute)
        } else {
          navigateToHome()
        }
      } catch {
        setErrorMessage('Il y a eu un problème. Tu peux réessayer plus tard')
      }
    },
    [
      culturalSurveyRoute,
      navigate,
      props.doNotNavigateOnSigninSuccess,
      setErrorMessage,
      setIsLoading,
    ]
  )

  const handleSigninFailure = useCallback(
    (response: SignInResponseFailure) => {
      const failureCode = response.content?.code
      if (failureCode === 'EMAIL_NOT_VALIDATED') {
        navigate('SignupConfirmationEmailSent', { email })
      } else if (failureCode === 'ACCOUNT_DELETED') {
        setEmailErrorMessage('Cette adresse e-mail est liée à un compte supprimé')
      } else if (failureCode === 'NETWORK_REQUEST_FAILED') {
        setIsLoading(false)
        setErrorMessage('Erreur réseau. Tu peux réessayer une fois la connexion réétablie')
      } else if (response.statusCode === 429 || failureCode === 'TOO_MANY_ATTEMPTS') {
        setIsLoading(false)
        setErrorMessage('Nombre de tentatives dépassé. Réessaye dans 1 minute')
      } else {
        setIsLoading(false)
        setErrorMessage('E-mail ou mot de passe incorrect')
      }
    },
    [email, navigate, setEmailErrorMessage, setErrorMessage, setIsLoading]
  )

  const handleSignin = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)
    if (!isEmailValid(email)) {
      setEmailErrorMessage(
        'L’e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr'
      )
    } else {
      const signinResponse = await signIn({ identifier: email, password })
      if (signinResponse.isSuccess) {
        handleSigninSuccess(signinResponse.accountState)
      } else {
        handleSigninFailure(signinResponse)
      }
    }
  }, [
    email,
    handleSigninFailure,
    handleSigninSuccess,
    password,
    setEmailErrorMessage,
    setErrorMessage,
    setIsLoading,
    signIn,
  ])

  const onSubmit = useCallback(async () => {
    if (!shouldDisableLoginButton) {
      Keyboard.dismiss()
      handleSignin()
    }
  }, [handleSignin, shouldDisableLoginButton])

  const onClose = useCallback(() => {
    navigateToHome()
  }, [])

  const onForgottenPasswordClick = useCallback(() => {
    navigate('ForgottenPassword')
  }, [navigate])

  const onLogSignUpAnalytics = useCallback(() => {
    analytics.logSignUp({ from: 'Login' })
  }, [])

  const rightIconProps = params?.preventCancellation
    ? {
        rightIconAccessibilityLabel: undefined,
        rightIcon: undefined,
        onRightIconPress: undefined,
      }
    : {
        rightIconAccessibilityLabel: 'Revenir à l’accueil',
        rightIcon: Close,
        onRightIconPress: onClose,
      }
  return (
    <BottomContentPage>
      <ModalHeader
        title="Connecte-toi&nbsp;!"
        leftIconAccessibilityLabel="Revenir en arrière"
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        {...rightIconProps}
      />
      <Form.MaxWidth>
        <InputError
          visible={!!errorMessage}
          messageId={errorMessage}
          numberOfSpacesTop={5}
          centered
        />
        <Spacer.Column numberOfSpaces={7} />
        <EmailInput
          label="Adresse e-mail"
          email={email}
          onEmailChange={onEmailChange}
          isError={!!emailErrorMessage || !!errorMessage}
          isRequiredField
          autoFocus
          accessibilityDescribedBy={emailInputErrorId}
        />
        <InputError
          visible={!!emailErrorMessage}
          messageId={emailErrorMessage}
          numberOfSpacesTop={2}
          relatedInputId={emailInputErrorId}
        />
        <Spacer.Column numberOfSpaces={6} />
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          isError={!!errorMessage}
          onSubmitEditing={onSubmit}
          isRequiredField
        />
        <Spacer.Column numberOfSpaces={2} />
        <ButtonContainer>
          <ButtonTertiaryBlack
            wording="Mot de passe oublié&nbsp;?"
            onPress={onForgottenPasswordClick}
            icon={Key}
            inline
          />
        </ButtonContainer>

        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          wording="Se connecter"
          onPress={onSubmit}
          disabled={shouldDisableLoginButton}
        />
      </Form.MaxWidth>
      <Spacer.Column numberOfSpaces={8} />
      <AuthenticationButton type="signup" onAdditionalPress={onLogSignUpAnalytics} />
    </BottomContentPage>
  )
})

const ButtonContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  width: '100%',
  maxWidth: theme.buttons.maxWidth,
}))
