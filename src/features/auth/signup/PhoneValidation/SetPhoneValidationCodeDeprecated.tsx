import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js'
import React, { useCallback, useState, memo } from 'react'
import { MaskedTextInput } from 'react-native-mask-text'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import { QuitSignupModal } from 'features/auth/components/QuitSignupModal'
import { Paragraphe } from 'features/auth/components/signupComponents'
import { useAppSettings } from 'features/auth/settings'
import { SignupStep } from 'features/auth/signup/enums'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { contactSupport } from 'features/auth/support.services'
import {
  useSendPhoneValidationMutation,
  useValidatePhoneNumberMutation,
} from 'features/identityCheck/api/api'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { amplitude } from 'libs/amplitude'
import { currentTimestamp } from 'libs/dates'
import { captureMonitoringError } from 'libs/monitoring'
import { storage } from 'libs/storage'
import { TIMER_NOT_INITIALIZED, useTimer } from 'libs/timer'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { InputError } from 'ui/components/inputs/InputError'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const TIMER = 60

export const SetPhoneValidationCodeDeprecated = memo(function SetPhoneValidationCodeComponent() {
  const [error, setError] = useState<Error | undefined>()
  const { appContentWidth } = useTheme()
  const { data: settings } = useAppSettings()
  const { phoneValidation } = useIdentityCheckContext()
  const formattedPhoneNumber = phoneValidation?.phoneNumber
    ? formatPhoneNumber(phoneValidation?.phoneNumber, phoneValidation?.countryCode as CountryCode)
    : ''

  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('SetPhoneNumberDeprecated', undefined)
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
  const validationCodeInputId = uuidv4()

  const isRequestTimestampExpired =
    !validationCodeRequestTimestamp ||
    timeSinceLastRequest === TIMER_NOT_INITIALIZED ||
    timeSinceLastRequest >= TIMER

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation(setError)

  useFocusEffect(
    useCallback(() => {
      if (!phoneValidation) {
        setTimeout(() => navigate('SetPhoneNumberDeprecated'))
      }
    }, [phoneValidation, navigate])
  )

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
      storage.readObject('phone_validation_code_asked_at').then((value) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValidationCodeRequestTimestamp(value as any)
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  async function onValidateSuccess() {
    navigateToNextBeneficiaryValidationStep()
  }

  function onError(err: unknown | ApiError) {
    const { content } = err as ApiError
    if (content.code === 'TOO_MANY_VALIDATION_ATTEMPTS') {
      navigate('PhoneValidationTooManyAttempts')
    } else if (content.code === 'TOO_MANY_SMS_SENT') {
      navigate('PhoneValidationTooManySMSSent')
    } else {
      setErrorMessage(extractApiErrorMessage(err))
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
      isValid: !!value && hasCodeCorrectFormat(value),
    })
  }

  async function validateCode() {
    if (codeInputState.isValid) {
      setErrorMessage('')
      const { code } = codeInputState
      if (code) {
        if (settings?.enableNativeIdCheckVerboseDebugging) {
          const errMessage = `Request info : ${JSON.stringify({ code })}`
          captureMonitoringError(errMessage, 'validatePhoneNumber')
        }
        validatePhoneNumber(code)
      }
    }

    await amplitude().logEvent('young18_set_phone_validation_code_clicked_front')
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

  async function requestSendPhoneValidationCode() {
    if (isRequestTimestampExpired) {
      sendPhoneValidationCode(formattedPhoneNumber)
    }

    await amplitude().logEvent('young18_set_phone_validation_code_clicked_front')
  }

  const validationCodeInformation =
    t`Saisis le code envoyé par SMS au numéro` +
    ` ${formattedPhoneNumber}.` +
    '\n' +
    t`Attention tu n'as que 3 tentatives.`

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
          <Form.MaxWidth>
            <Paragraphe>
              <Typo.Body>{validationCodeInformation}</Typo.Body>
            </Paragraphe>
            <Spacer.Column numberOfSpaces={6} />
            <CodeInputContainer>
              <CodeInput
                value={codeInputState.code}
                isEmpty={!codeInputState.code}
                onChangeText={(_text, rawText) => {
                  onChangeValue(rawText ?? '')
                }}
                placeholder={codeInputPlaceholder}
                mask={codeInputMask}
                maxLength={codeInputPlaceholder.length}
                keyboardType="number-pad"
                onSubmitEditing={validateCode}
                aria-describedby={validationCodeInputId}
                {...accessibilityAndTestId(t`Entrée du code de confirmation`)}
              />
            </CodeInputContainer>
            <InputError
              visible={!!errorMessage}
              messageId={errorMessage}
              numberOfSpacesTop={3}
              relatedInputId={validationCodeInputId}
            />
            {errorMessage ? (
              <Spacer.Column numberOfSpaces={5} />
            ) : (
              <Spacer.Column numberOfSpaces={8} />
            )}
            <ButtonPrimary
              testID="Continuer"
              wording={t`Continuer`}
              accessibilityLabel={t`Continuer vers l'étape suivante`}
              disabled={!codeInputState.isValid}
              onPress={validateCode}
              isLoading={isLoading}
            />
          </Form.MaxWidth>
          <Spacer.Column numberOfSpaces={4} />
          <HelpRow>
            <Typo.Body>{t`Tu n'as pas reçu le sms\u00a0?`}</Typo.Body>
            {/* force button to wrap on small screen, otherwise timer will "unwrap" when timer is under 10 seconds */}
            {appContentWidth <= 320 ? <Break /> : <Spacer.Row numberOfSpaces={1} />}
            <ButtonTertiary
              wording={getRetryButtonTitle()}
              testID={'Réessayer'}
              onPress={requestSendPhoneValidationCode}
              inline
              disabled={!isRequestTimestampExpired}
            />
          </HelpRow>
          <Spacer.Column numberOfSpaces={4} />
          <GreyMediumSeparator />
          <Spacer.Column numberOfSpaces={4} />
          <HelpRow>
            <Typo.Caption>{t`Si tu n’arrives pas à valider ton code tu peux`}</Typo.Caption>
            {appContentWidth <= 320 ? <Break /> : <Spacer.Row numberOfSpaces={1} />}
            <TouchableLink
              as={ButtonQuaternary}
              wording={t`Contacter le support`}
              accessibilityLabel={t`Ouvrir le gestionnaire mail pour contacter le support`}
              icon={Email}
              externalNav={contactSupport.forPhoneNumberConfirmation}
              inline
            />
          </HelpRow>
        </ModalContent>
      </BottomContentPage>
      <QuitSignupModal
        testIdSuffix="phone-validation-quit-signup"
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        signupStep={SignupStep.PhoneNumber}
      />
    </React.Fragment>
  )
})

const codeInputPlaceholder = '000000'
const codeInputMask = '999999'

const CodeInput = styled(MaskedTextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.typography.placeholder.color,
}))<{ isEmpty: boolean }>(({ theme, isEmpty }) => ({
  fontSize: getSpacing(5),
  marginLeft: getSpacing(4),
  color: theme.colors.black,
  textAlign: 'center',
  fontFamily: isEmpty ? theme.fontFamily.italic : theme.fontFamily.regular,
  letterSpacing: getSpacing(4),
}))

const CodeInputContainer = styled.View({
  width: 240,
  marginHorizontal: 'auto',
})

const hasCodeCorrectFormat = (code: string) => {
  // exactly 6 digits, no spaces
  return !!code.match(/^\d{6}$/)
}

// returns a formatted phone number like +33 X XX XX XX XX with unbreakable spaces
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

const HelpRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  flexWrap: 'wrap',
  alignItems: 'center',
  maxWidth: theme.contentPage.maxWidth,
}))

const GreyMediumSeparator = styled(Separator).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
}))``
