import { t } from '@lingui/macro'
import Profiling from '@pass-culture/react-native-profiling'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js'
import React, { useCallback, useState, useMemo, memo } from 'react'
import { Platform } from 'react-native'
import { MaskedTextInput } from 'react-native-mask-text'
import styled, { useTheme } from 'styled-components/native'

import { api } from 'api/api'
import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import { UserProfilingFraudRequest } from 'api/gen'
import { useSendPhoneValidationMutation, useValidatePhoneNumberMutation } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { useAppSettings } from 'features/auth/settings'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { contactSupport } from 'features/auth/support.services'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { currentTimestamp } from 'libs/dates'
import { env } from 'libs/environment'
import { eventMonitoring, MonitoringError } from 'libs/monitoring'
// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'
import { storage } from 'libs/storage'
import { TIMER_NOT_INITIALIZED, useTimer } from 'libs/timer'
import { accessibilityAndTestId } from 'tests/utils'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { InputError } from 'ui/components/inputs/InputError'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const CODE_INPUT_LENGTH = 6
const AGENT_TYPE = Platform.select({
  default: 'agent_mobile',
  web: isDesktopDeviceDetectOnWeb ? 'browser_computer' : 'browser_mobile',
})

export interface SetPhoneValidationCodeModalProps {
  visible: boolean
  dismissModal: () => void
  phoneNumber: string
  onGoBack: () => void
}

const TIMER = 60

export type SetPhoneValidationCodeProps = StackScreenProps<
  RootStackParamList,
  'SetPhoneValidationCode'
>

export const SetPhoneValidationCode = memo(function SetPhoneValidationCodeComponent({
  route,
}: SetPhoneValidationCodeProps) {
  const { appContentWidth } = useTheme()
  const { data: settings } = useAppSettings()
  const formattedPhoneNumber = formatPhoneNumber(
    route.params.phoneNumber,
    route.params.countryCode as CountryCode
  )
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('SetPhoneNumber', undefined)
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [codeInputState, setCodeInputState] = useState({
    code: '',
    isValid: false,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [validationCodeRequestTimestamp, setValidationCodeRequestTimestamp] = useState<
    null | number
  >(null)

  const timeSinceLastRequest = useTimer(
    validationCodeRequestTimestamp,
    (elapsedTime: number) => elapsedTime > TIMER
  )

  const isRequestTimestampExpired =
    !validationCodeRequestTimestamp ||
    timeSinceLastRequest === TIMER_NOT_INITIALIZED ||
    timeSinceLastRequest >= TIMER

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  const { error, navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()

  const { mutate: validatePhoneNumber, isLoading } = useValidatePhoneNumberMutation({
    onSuccess: onValidateSuccess,
    onError,
  })

  const { mutate: sendPhoneValidationCode } = useSendPhoneValidationMutation({
    onSuccess: onSendCodeSuccess,
    onError,
  })

  useFocusEffect(
    useCallback(() => {
      Profiling.profileDevice(
        env.TMX_ORGID,
        env.TMX_FPSERVER,
        setSessionId,
        () => api.getnativev1userProfilingsessionId(),
        eventMonitoring.captureException
      )
    }, [])
  )
  useFocusEffect(
    useCallback(() => {
      storage.readObject('phone_validation_code_asked_at').then((value) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValidationCodeRequestTimestamp(value as any)
      })
    }, [route.params])
  )

  async function onValidateSuccess() {
    if (!sessionId) {
      eventMonitoring.captureException(new Error('TMX sessionId is null'))
    } else {
      await api
        .postnativev1userProfiling({
          agentType: AGENT_TYPE,
          sessionId,
        } as UserProfilingFraudRequest)
        .catch(eventMonitoring.captureException)
    }
    navigateToNextBeneficiaryValidationStep()
  }

  function onError(error: unknown | ApiError) {
    const { content } = error as ApiError
    if (content.code === 'TOO_MANY_VALIDATION_ATTEMPTS') {
      navigate('PhoneValidationTooManyAttempts')
    } else if (content.code === 'TOO_MANY_SMS_SENT') {
      navigate('PhoneValidationTooManySMSSent')
    } else {
      setErrorMessage(extractApiErrorMessage(error))
    }
  }

  function onSendCodeSuccess() {
    const now = currentTimestamp()
    storage.saveObject('phone_validation_code_asked_at', now)
    setValidationCodeRequestTimestamp(now)
  }

  function onChangeValue(value: string) {
    setCodeInputState({
      code: value,
      isValid: !!value && value.length === CODE_INPUT_LENGTH,
    })
  }

  function validateCode() {
    if (codeInputState.isValid) {
      setErrorMessage('')
      const { code } = codeInputState
      if (code) {
        if (settings?.enableNativeIdCheckVerboseDebugging) {
          const errorMessage = `Request info : ${JSON.stringify({
            code,
          })}`
          new MonitoringError(errorMessage, 'validatePhoneNumber')
        }
        validatePhoneNumber(code)
      }
    }
  }

  function onGoBack() {
    setErrorMessage('')
    goBack()
  }

  function getRetryButtonTitle() {
    if (isRequestTimestampExpired) return t`Réessayer`
    const remainingTime = TIMER - timeSinceLastRequest
    return t`Attends` + ` ${remainingTime}s.`
  }

  function requestSendPhoneValidationCode() {
    if (isRequestTimestampExpired) {
      sendPhoneValidationCode(formattedPhoneNumber)
    }
  }

  const validationCodeInformation = useMemo(
    () =>
      t`Saisis le code envoyé par SMS au numéro` +
      ` ${formattedPhoneNumber}.` +
      '\n' +
      t`Attention tu n'as que 3 tentatives.`,
    [route.params]
  )

  if (error) {
    throw error
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Confirme ton numéro`}
          leftIconAccessibilityLabel={t`Revenir en arrière`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={onGoBack}
          rightIconAccessibilityLabel={t`Revenir sur l'écran d'envoi de SMS`}
          rightIcon={Close}
          onRightIconPress={showFullPageModal}
        />
        <ModalContent>
          <Spacer.Column numberOfSpaces={6} />

          <Paragraphe>
            <Typo.Body>{validationCodeInformation}</Typo.Body>
          </Paragraphe>
          <Spacer.Column numberOfSpaces={6} />
          <CodeInputContainer>
            <CodeInput
              onChangeText={(text, rawText) => {
                onChangeValue(rawText ?? '')
              }}
              placeholder={codeInputPlaceholder}
              placeholderTextColor={ColorsEnum.GREY_DARK}
              mask={codeInputMask}
              maxLength={codeInputPlaceholder.length}
              keyboardType="number-pad"
              onSubmitEditing={validateCode}
              {...accessibilityAndTestId(t`Entrée du code de confirmation`)}
            />
          </CodeInputContainer>
          {errorMessage ? (
            <React.Fragment>
              <InputError visible messageId={errorMessage} numberOfSpacesTop={3} />
              <Spacer.Column numberOfSpaces={5} />
            </React.Fragment>
          ) : (
            <Spacer.Column numberOfSpaces={8} />
          )}
          <ButtonPrimary
            title={t`Continuer`}
            disabled={!codeInputState.isValid}
            onPress={validateCode}
            isLoading={isLoading}
          />
          <Spacer.Column numberOfSpaces={4} />
          <HelpRow>
            <Typo.Body>{t`Tu n'as pas reçu le sms ?`}</Typo.Body>
            {/* force button to wrap on small screen, otherwise timer will "unwrap" when timer is under 10 seconds */}
            {appContentWidth <= 320 ? <Break /> : null}
            <ButtonTertiary
              title={getRetryButtonTitle()}
              testId={'Réessayer'}
              onPress={requestSendPhoneValidationCode}
              inline
              disabled={!isRequestTimestampExpired}
            />
          </HelpRow>
          <Spacer.Column numberOfSpaces={4} />
          <Separator color={ColorsEnum.GREY_MEDIUM} />
          <Spacer.Column numberOfSpaces={4} />
          <HelpRow>
            <Typo.Caption color={ColorsEnum.GREY_DARK}>
              {t`Si tu n’arrives pas à récupérer ton code tu peux`}
              <Spacer.Row numberOfSpaces={1} />
              <ButtonQuaternary
                title={t`Contacter le support`}
                icon={Email}
                onPress={contactSupport.forPhoneNumberConfirmation}
                inline
              />
            </Typo.Caption>
          </HelpRow>
        </ModalContent>
      </BottomContentPage>
      <QuitSignupModal
        testIdSuffix="phone-validation-quit-signup"
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        signupStep={SignupSteps.PhoneNumber}
      />
    </React.Fragment>
  )
})

const codeInputPlaceholder = '000000'
const codeInputMask = '999999'

const CodeInput = styled(MaskedTextInput)({
  fontSize: 20,
  marginLeft: getSpacing(2),
  color: ColorsEnum.BLACK,
  textAlign: 'center',
  fontFamily: 'Montserrat-Regular',
  letterSpacing: getSpacing(4),
})

const CodeInputContainer = styled.View({
  width: 240,
})

/** returns a formatted phone number like +33 X XX XX XX XX with unbreakable spaces
 */
export const formatPhoneNumber = (phoneNumber: string, countryCode: CountryCode) => {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber, countryCode)
  return parsedPhoneNumber?.formatInternational().replace(/ /g, '\u00a0') || ''
}

const Break = styled.View({
  flexBasis: '100%',
})

const ModalContent = styled.View({
  width: '100%',
  alignItems: 'center',
})

const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})

const HelpRow = styled.View({
  flexDirection: 'row',
  width: '100%',
  flexWrap: 'wrap',
  alignItems: 'center',
})
