import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js'
import React, { useCallback, FC, useState, useMemo } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { ApiError, extractApiErrorMessage } from 'api/helpers'
import { useSendPhoneValidationMutation, useValidatePhoneNumberMutation } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { contactSupport } from 'features/auth/support.services'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { currentTimestamp } from 'libs/dates'
import { storage } from 'libs/storage'
import { TIMER_NOT_INITIALIZED, useTimer } from 'libs/timer'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { CodeInput, CodeValidation } from 'ui/components/inputs/CodeInput'
import { InputError } from 'ui/components/inputs/InputError'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

const CODE_INPUT_LENGTH = 6

const screenWidth = Dimensions.get('window').width

export interface SetPhoneValidationCodeModalProps {
  visible: boolean
  dismissModal: () => void
  phoneNumber: string
  onGoBack: () => void
}

interface CodeInputState extends CodeValidation {
  code: string | null
}

const TIMER = 60

export type SetPhoneValidationCodeProps = StackScreenProps<
  RootStackParamList,
  'SetPhoneValidationCode'
>

export const SetPhoneValidationCode: FC<SetPhoneValidationCodeProps> = ({ route }) => {
  const { phoneNumber, countryCode } = route.params
  const { navigate, canGoBack, goBack } = useNavigation<UseNavigationType>()
  const [codeInputState, setCodeInputState] = useState<CodeInputState>({
    code: null,
    isComplete: false,
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

  const { mutate: validatePhoneNumber } = useValidatePhoneNumberMutation({
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
    }, [route.params])
  )

  function onValidateSuccess() {
    navigateToNextBeneficiaryValidationStep()
  }

  function onError(error: unknown | ApiError) {
    const { content } = error as ApiError
    if (content.code === 'TOO_MANY_VALIDATION_ATTEMPTS' || content.code === 'TOO_MANY_SMS_SENT') {
      navigate('PhoneValidationTooManyAttempts')
    } else {
      setErrorMessage(extractApiErrorMessage(error))
    }
  }

  function onSendCodeSuccess() {
    const now = currentTimestamp()
    storage.saveObject('phone_validation_code_asked_at', now)
    setValidationCodeRequestTimestamp(now)
  }

  function onChangeValue(value: string | null, validation: CodeValidation) {
    setCodeInputState({
      code: value,
      ...validation,
    })
  }

  function validateCode() {
    setErrorMessage('')
    const { code } = codeInputState
    if (code) {
      validatePhoneNumber(code)
    }
  }

  function onGoBack() {
    setErrorMessage('')
    if (canGoBack()) {
      goBack()
    }
  }

  function getRetryButtonTitle() {
    if (isRequestTimestampExpired) return t`Réessayer`
    const remainingTime = TIMER - timeSinceLastRequest
    return t`Attends` + ` ${remainingTime}s.`
  }

  function requestSendPhoneValidationCode() {
    if (isRequestTimestampExpired) {
      sendPhoneValidationCode(phoneNumber)
    }
  }

  const validationCodeInformation = useMemo(
    () =>
      t`Saisis le code envoyé par SMS au numéro` +
      ` ${formatPhoneNumber(phoneNumber, countryCode as CountryCode)}.` +
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
          leftIcon={ArrowPrevious}
          onLeftIconPress={onGoBack}
          rightIcon={Close}
          onRightIconPress={showFullPageModal}
        />
        <ModalContent>
          <Spacer.Column numberOfSpaces={6} />

          <Paragraphe>
            <Typo.Body>{validationCodeInformation}</Typo.Body>
          </Paragraphe>
          <Spacer.Column numberOfSpaces={6} />
          <CodeInput
            codeLength={CODE_INPUT_LENGTH}
            placeholder={'0'}
            enableValidation
            isValid={isCodeValid}
            isInputValid={isInputValid}
            onChangeValue={onChangeValue}
          />
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
          />
          <Spacer.Column numberOfSpaces={4} />
          <HelpRow>
            <Typo.Body>{t`Tu n'as pas reçu le sms ?`}</Typo.Body>
            {/* force button to wrap on small screen, otherwise timer will "unwrap" when timer is under 10 seconds */}
            {screenWidth <= 320 ? <Break /> : null}
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
}

/** returns a formatted phone number like +33 X XX XX XX XX with unbreakable spaces
 */
export const formatPhoneNumber = (phoneNumber: string, countryCode: CountryCode) => {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber, countryCode)
  return parsedPhoneNumber?.formatInternational().replace(/ /g, '\u00a0')
}

const isCodeValid = (code: string | null, _isComplete: boolean) => {
  return code !== null && !isNaN(Number(code)) && code.length === CODE_INPUT_LENGTH
}

const isInputValid = (inputValue: string, _position: number) => {
  return !isNaN(Number(inputValue)) && inputValue.length === 1
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
