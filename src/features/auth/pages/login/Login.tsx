import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, memo, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { AccountState, FavoriteResponse } from 'api/gen'
import { useSignIn } from 'features/auth/api/useSignIn'
import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { loginSchema } from 'features/auth/pages/login/schema/loginSchema'
import { SignInResponseFailure } from 'features/auth/types'
import { useAddFavorite } from 'features/favorites/api'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'
import { shouldShowCulturalSurvey } from 'shared/culturalSurvey/shouldShowCulturalSurvey'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { From } from 'shared/offer/enums'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Form } from 'ui/components/Form'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { InputError } from 'ui/components/inputs/InputError'
import { SNACK_BAR_TIME_OUT_LONG, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Key } from 'ui/svg/icons/Key'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type LoginFormData = {
  email: string
  password: string
}

type Props = {
  doNotNavigateOnSigninSuccess?: boolean
}

export const Login: FunctionComponent<Props> = memo(function Login(props) {
  const { params } = useRoute<UseRouteType<'Login'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { showInfoSnackBar } = useSnackBarContext()

  const {
    handleSubmit,
    control,
    watch,
    setError: setFormErrors,
    formState: { isValid },
  } = useForm<LoginFormData>({
    mode: 'all',
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    delayError: SUGGESTION_DELAY_IN_MS,
  })
  const email = watch('email')

  const [errorMessage, setErrorMessage] = useSafeState<string | null>(null)

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
        setFormErrors('email', { message: 'Cette adresse e-mail est liée à un compte supprimé' })
      } else if (failureCode === 'NETWORK_REQUEST_FAILED') {
        setErrorMessage('Erreur réseau. Tu peux réessayer une fois la connexion réétablie')
      } else if (response.statusCode === 429 || failureCode === 'TOO_MANY_ATTEMPTS') {
        setErrorMessage('Nombre de tentatives dépassé. Réessaye dans 1 minute')
      } else {
        setErrorMessage('E-mail ou mot de passe incorrect')
      }
    },
    [email, navigate, setFormErrors, setErrorMessage]
  )

  const { mutate: signIn, isLoading } = useSignIn({
    onSuccess: (response) => handleSigninSuccess(response.accountState),
    onFailure: handleSigninFailure,
  })

  const shouldDisableLoginButton = !isValid || isLoading

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      if (!shouldDisableLoginButton) {
        setErrorMessage('')
        Keyboard.dismiss()
        signIn({ identifier: data.email, password: data.password })
      }
    },
    [shouldDisableLoginButton, signIn, setErrorMessage]
  )

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
        <EmailInputController name="email" control={control} autoFocus isRequiredField />
        <Spacer.Column numberOfSpaces={6} />
        <PasswordInputController
          name="password"
          control={control}
          onSubmitEditing={handleSubmit(onSubmit)}
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
          onPress={handleSubmit(onSubmit)}
          disabled={shouldDisableLoginButton}
        />
      </Form.MaxWidth>
      <Spacer.Column numberOfSpaces={8} />
      <SignUpButton onAdditionalPress={onLogSignUpAnalytics} />
    </SecondaryPageWithBlurHeader>
  )
})

const ButtonContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.buttons.maxWidth,
}))

const SignUpButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.colors.secondary,
  type: 'signup',
}))``
