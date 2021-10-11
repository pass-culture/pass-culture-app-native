import { t } from '@lingui/macro'
import { useNetInfo } from '@react-native-community/netinfo'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useEffect, useState, useCallback, useMemo } from 'react'

import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { CardContent, Paragraphe } from 'features/auth/components/signupComponents'
import { contactSupport } from 'features/auth/support.services'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { env } from 'libs/environment'
import { AsyncError, MonitoringError } from 'libs/monitoring'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'
import { BottomCardContentContainer, BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { InputError } from 'ui/components/inputs/InputError'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { SIGNUP_NUMBER_OF_STEPS, useSignUp } from '../api'
import { useAppSettings } from '../settings'

type Props = StackScreenProps<RootStackParamList, 'AcceptCgu'>

export const AcceptCgu: FC<Props> = ({ route }) => {
  const { data: settings, isLoading: areSettingsLoading } = useAppSettings()
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('SetBirthday', route.params)
  const signUp = useSignUp()
  const networkInfo = useNetInfo()
  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  const [isDoingReCaptchaChallenge, setIsDoingReCaptchaChallenge] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!networkInfo.isConnected) {
      setErrorMessage(t`Hors connexion : en attente du réseau.`)
      setIsDoingReCaptchaChallenge(false)
    } else {
      setErrorMessage(null)
    }
  }, [networkInfo.isConnected])

  const subscribe = useCallback(
    (token: string) =>
      (async () => {
        const { birthday, email, isNewsletterChecked, password, postalCode } = route.params
        setErrorMessage(null)
        const signUpData = {
          birthdate: birthday,
          email,
          marketingEmailSubscription: isNewsletterChecked,
          password,
          postalCode,
          token,
        }
        try {
          setIsFetching(true)
          const signupResponse = await signUp(signUpData)
          if (!signupResponse?.isSuccess) {
            throw new AsyncError('NETWORK_REQUEST_FAILED')
          }
          navigate('SignupConfirmationEmailSent', { email })
        } catch {
          setErrorMessage(t`Un problème est survenu pendant l'inscription, réessaie plus tard.`)
          const errorMessage = `Request info : ${JSON.stringify({
            ...signUpData,
            password: 'excludedFromSentryLog',
            captchaSiteKey: env.SITE_KEY,
          })}`
          new MonitoringError(errorMessage, 'AcceptCguSignUpError')
        } finally {
          setIsFetching(false)
        }
      })(),
    [route.params]
  )

  const openReCaptchaChallenge = useCallback(() => {
    if (!networkInfo.isConnected) {
      return
    }
    setIsDoingReCaptchaChallenge(true)
    setErrorMessage(null)
  }, [networkInfo.isConnected])

  function onReCaptchaClose() {
    setIsDoingReCaptchaChallenge(false)
  }

  function onReCaptchaError(error: string) {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage(t`Un problème est survenu pendant l'inscription, réessaie plus tard.`)
    new MonitoringError(error, 'AcceptCguOnReCaptchaError')
  }

  function onReCaptchaExpire() {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage(t`Le token reCAPTCHA a expiré, tu peux réessayer.`)
  }

  function onReCaptchaSuccess(token: string) {
    setIsDoingReCaptchaChallenge(false)
    subscribe(token)
  }

  const onSubmit = useCallback(() => {
    settings?.isRecaptchaEnabled ? openReCaptchaChallenge() : subscribe('dummyToken')
  }, [settings?.isRecaptchaEnabled, subscribe, openReCaptchaChallenge])

  const disabled = useMemo(
    () => isDoingReCaptchaChallenge || isFetching || !networkInfo.isConnected || areSettingsLoading,
    [isDoingReCaptchaChallenge, isFetching, networkInfo.isConnected, areSettingsLoading]
  )

  return (
    <React.Fragment>
      <BottomContentPage>
        {!!settings?.isRecaptchaEnabled && (
          <ReCaptcha
            onClose={onReCaptchaClose}
            onError={onReCaptchaError}
            onExpire={onReCaptchaExpire}
            onSuccess={onReCaptchaSuccess}
            isVisible={isDoingReCaptchaChallenge}
          />
        )}
        <ModalHeader
          title={t`CGU & Données`}
          leftIconAccessibilityLabel={t`Revenir en arrière`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          rightIconAccessibilityLabel={t`Revenir à l'accueil`}
          rightIcon={Close}
          onRightIconPress={showFullPageModal}
        />
        <BottomCardContentContainer>
          <CardContent>
            <Spacer.Column numberOfSpaces={5} />
            <Paragraphe>
              <Typo.Body>{t`En cliquant sur “Accepter et s’inscrire”, tu acceptes nos `}</Typo.Body>
              <ExternalLink
                text={t`Conditions Générales d'Utilisation`}
                url={env.CGU_LINK}
                color={ColorsEnum.PRIMARY}
                testID="external-link-cgu"
              />
              <Spacer.Row numberOfSpaces={1} />
              <Typo.Body>{t` ainsi que notre `}</Typo.Body>
              <ExternalLink
                text={t`Politique de confidentialité.`}
                color={ColorsEnum.PRIMARY}
                url={env.PRIVACY_POLICY_LINK}
                testID="external-link-privacy-policy"
              />
            </Paragraphe>
            <Spacer.Column numberOfSpaces={5} />
            <Paragraphe>
              <Typo.Body>
                {t`Pour en savoir plus sur la gestion de tes données personnelles et exercer tes droits tu peux :`}
              </Typo.Body>
            </Paragraphe>
            <ButtonTertiary
              title={t`Contacter le support`}
              onPress={contactSupport.forGenericQuestion}
              icon={Email}
            />
            <Spacer.Column numberOfSpaces={6} />
            <ButtonPrimary
              title={t`Accepter et s’inscrire`}
              // Token needs to be a non-empty string even when ReCaptcha validation is deactivated
              // Cf. backend logic for token validation
              onPress={onSubmit}
              isLoading={isDoingReCaptchaChallenge || isFetching}
              disabled={disabled}
              submitOnEnterWeb
            />
            {!!errorMessage && (
              <InputError visible messageId={errorMessage} numberOfSpacesTop={5} />
            )}
            <Spacer.Column numberOfSpaces={5} />
            <StepDots numberOfSteps={SIGNUP_NUMBER_OF_STEPS} currentStep={SIGNUP_NUMBER_OF_STEPS} />
          </CardContent>
        </BottomCardContentContainer>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="cgu-quit-signup"
        signupStep={SignupSteps.CGU}
      />
    </React.Fragment>
  )
}
