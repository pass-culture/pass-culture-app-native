import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, memo, useCallback, useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { api } from 'api/api'
import { AccountState, FavoriteResponse } from 'api/gen'
import { useSignIn } from 'features/auth/api/useSignIn'
import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { SignInResponseFailure } from 'features/auth/types'
import { useAddFavorite } from 'features/favorites/api'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { From } from 'features/offer/components/AuthenticationModal/fromEnum'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'
import { shouldShowCulturalSurvey } from 'shared/culturalSurvey/shouldShowCulturalSurvey'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Form } from 'ui/components/Form'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { SNACK_BAR_TIME_OUT_LONG, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Key } from 'ui/svg/icons/Key'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

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
  const { colors } = useTheme()
  const [email, setEmail] = useState(INITIAL_IDENTIFIER)
  const [password, setPassword] = useState(INITIAL_PASSWORD)
  const [errorMessage, setErrorMessage] = useSafeState<string | null>(null)
  const [emailErrorMessage, setEmailErrorMessage] = useSafeState<string | null>(null)
  const emailInputErrorId = uuidv4()
  const { showInfoSnackBar } = useSnackBarContext()

  const { params } = useRoute<UseRouteType<'Login'>>()
  const { navigate } = useNavigation<UseNavigationType>()

  const onAddFavoriteSuccess = useCallback((data?: FavoriteResponse) => {
    if (data?.offer?.id) {
      analytics.logHasAddedOfferToFavorites({ from: 'login', offerId: data.offer.id })
    }
  }, [])

  const { mutate: addFavorite } = useAddFavorite({
    onSuccess: onAddFavoriteSuccess,
  })

  useEffect(() => {
    if (params?.displayForcedLoginHelpMessage) {
      showInfoSnackBar({
        message:
          'Pour sécuriser ton pass Culture, tu dois confirmer tes identifiants tous les 30 jours.',
        timeout: SNACK_BAR_TIME_OUT_LONG,
      })
    }
  }, [params?.displayForcedLoginHelpMessage, showInfoSnackBar])

  const onEmailChange = useCallback(
    (mail: string) => {
      if (emailErrorMessage) {
        setEmailErrorMessage(null)
      }
      setEmail(mail)
    },
    [emailErrorMessage, setEmailErrorMessage]
  )

  const offerId = params?.offerId
  const handleSigninSuccess = useCallback(
    async (accountState: AccountState) => {
      try {
        if (props.doNotNavigateOnSigninSuccess) {
          return
        }
        if (accountState !== AccountState.ACTIVE) {
          return navigate('SuspensionScreen')
        }

        const user = await api.getnativev1me()
        const hasSeenEligibleCard = !!(await storage.readObject('has_seen_eligible_card'))

        if (user?.recreditAmountToShow) {
          navigate('RecreditBirthdayNotification')
        } else if (!hasSeenEligibleCard && user.showEligibleCard) {
          navigate('EighteenBirthday')
        } else if (shouldShowCulturalSurvey(user)) {
          navigate('CulturalSurveyIntro')
        } else if (offerId) {
          switch (params.from) {
            case From.BOOKING:
              navigate('Offer', { id: offerId, openModalOnNavigation: true })
              return

            case From.FAVORITE:
              addFavorite({ offerId })
              navigate('Offer', { id: offerId })
              return
          }
        } else {
          navigateToHome()
        }
      } catch {
        setErrorMessage('Il y a eu un problème. Tu peux réessayer plus tard')
      }
    },
    [
      offerId,
      navigate,
      props.doNotNavigateOnSigninSuccess,
      setErrorMessage,
      params?.from,
      addFavorite,
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
        setErrorMessage('Erreur réseau. Tu peux réessayer une fois la connexion réétablie')
      } else if (response.statusCode === 429 || failureCode === 'TOO_MANY_ATTEMPTS') {
        setErrorMessage('Nombre de tentatives dépassé. Réessaye dans 1 minute')
      } else {
        setErrorMessage('E-mail ou mot de passe incorrect')
      }
    },
    [email, navigate, setEmailErrorMessage, setErrorMessage]
  )

  const { mutate: signIn, isLoading } = useSignIn({
    onSuccess: (response) => handleSigninSuccess(response.accountState),
    onFailure: handleSigninFailure,
  })

  const shouldDisableLoginButton = isValueEmpty(email) || isValueEmpty(password) || isLoading

  const onSubmit = useCallback(async () => {
    if (!shouldDisableLoginButton) {
      Keyboard.dismiss()
      setErrorMessage(null)
      if (!isEmailValid(email)) {
        setEmailErrorMessage(
          'L’e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr'
        )
      } else {
        signIn({ identifier: email, password: password })
      }
    }
  }, [shouldDisableLoginButton, signIn, email, password, setEmailErrorMessage, setErrorMessage])

  const onForgottenPasswordClick = useCallback(() => {
    navigate('ForgottenPassword')
  }, [navigate])

  const onLogSignUpAnalytics = useCallback(() => {
    analytics.logSignUpClicked({ from: 'login' })
  }, [])

  return (
    <SecondaryPageWithBlurHeader headerTitle="Connexion" shouldDisplayBackButton>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title3 {...getHeadingAttrs(1)}>Connecte-toi</Typo.Title3>
      <Spacer.Column numberOfSpaces={2} />
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
        <Spacer.Column numberOfSpaces={5} />
        <ButtonContainer>
          <ButtonTertiaryBlack
            wording="Mot de passe oublié&nbsp;?"
            onPress={onForgottenPasswordClick}
            icon={Key}
            inline
          />
        </ButtonContainer>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary
          wording="Se connecter"
          onPress={onSubmit}
          disabled={shouldDisableLoginButton}
        />
      </Form.MaxWidth>
      <Spacer.Column numberOfSpaces={8} />
      <AuthenticationButton
        type="signup"
        onAdditionalPress={onLogSignUpAnalytics}
        linkColor={colors.secondary}
      />
    </SecondaryPageWithBlurHeader>
  )
})

const ButtonContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.buttons.maxWidth,
}))
