import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { memo, useEffect, useState } from 'react'
import { Country, CountryCode } from 'react-native-country-picker-modal'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import { useSendPhoneValidationMutation } from 'features/auth/api'
import { QuitSignupModal } from 'features/auth/components/QuitSignupModal'
import { useAppSettings } from 'features/auth/settings'
import { SignupStep } from 'features/auth/signup/enums'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { amplitude } from 'libs/amplitude'
import { CountryPicker, METROPOLITAN_FRANCE } from 'libs/country-picker'
import { currentTimestamp } from 'libs/dates'
import { useSafeState } from 'libs/hooks'
import { captureMonitoringError } from 'libs/monitoring'
import { storage } from 'libs/storage'
import { TIMER_NOT_INITIALIZED, useTimer } from 'libs/timer'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const TIMER = 60

function getPlaceholder(countryCode: CountryCode): string {
  if (countryCode === 'NC') return '654 321'
  return '6 12 34 56 78'
}

const INITIAL_COUNTRY = METROPOLITAN_FRANCE

export const SetPhoneNumber = memo(function SetPhoneNumberComponent() {
  const { data: settings } = useAppSettings()
  const { navigate } = useNavigation<UseNavigationType>()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [invalidPhoneNumberMessage, setInvalidPhoneNumberMessage] = useSafeState('')
  const [validationCodeRequestTimestamp, setValidationCodeRequestTimestamp] = useState<
    null | number
  >(null)
  const [country, setCountry] = useState<Country>(INITIAL_COUNTRY)
  const {
    visible: quitSignupModalVisible,
    showModal: showQuitSignupModal,
    hideModal: hideQuitSignupModal,
  } = useModal(false)

  const timeSinceLastRequest = useTimer(
    validationCodeRequestTimestamp,
    (elapsedTime: number) => elapsedTime > TIMER
  )
  const phoneNumberInputErrorId = uuidv4()

  const isRequestTimestampExpired =
    !validationCodeRequestTimestamp ||
    timeSinceLastRequest === TIMER_NOT_INITIALIZED ||
    timeSinceLastRequest >= TIMER

  const isPhoneValid = Boolean(isValidPhoneNumber(phoneNumber))

  useEffect(() => {
    storage.readObject('phone_validation_code_asked_at').then((value) => {
      setValidationCodeRequestTimestamp(value as number)
    })
  }, [])

  function onSuccess() {
    const now = currentTimestamp()
    storage.saveObject('phone_validation_code_asked_at', now)
    setValidationCodeRequestTimestamp(now)
    navigate('SetPhoneValidationCode', { phoneNumber, countryCode: country.cca2 })
  }

  function onError(error: ApiError | unknown) {
    const { content } = error as ApiError
    if (content.code === 'TOO_MANY_SMS_SENT') {
      navigate('PhoneValidationTooManySMSSent')
    } else {
      const message = extractApiErrorMessage(error)
      setInvalidPhoneNumberMessage(message)
    }
  }

  const { mutate: sendPhoneValidationCode, isLoading } = useSendPhoneValidationMutation({
    onSuccess,
    onError,
  })

  async function requestSendPhoneValidationCode() {
    const callingCode = country.callingCode[0]
    if (isContinueButtonEnabled && isRequestTimestampExpired && callingCode) {
      setInvalidPhoneNumberMessage('')
      const phoneNumberWithPrefix = '+' + callingCode + formatPhoneNumber(phoneNumber)
      if (settings?.enableNativeIdCheckVerboseDebugging) {
        const errorMessage = `Request info : ${JSON.stringify({
          phoneNumber: phoneNumberWithPrefix,
        })}`
        captureMonitoringError(errorMessage, 'sendPhoneValidationCode')
      }
      sendPhoneValidationCode(phoneNumberWithPrefix)
    }

    await amplitude().logEvent('young18_set_phone_number_clicked_front')
  }

  function onChangeText(value: string) {
    setPhoneNumber(value)
  }

  const isContinueButtonEnabled = isRequestTimestampExpired && isPhoneValid

  function getButtonTitle() {
    if (isRequestTimestampExpired) return t`Continuer`
    const remainingTime = TIMER - timeSinceLastRequest
    return t`Attends` + ` ${remainingTime}s.`
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Confirme ton numéro`}
          leftIconAccessibilityLabel={undefined}
          leftIcon={undefined}
          onLeftIconPress={undefined}
          rightIconAccessibilityLabel={t`Abandonner l'inscription`}
          rightIcon={Close}
          onRightIconPress={showQuitSignupModal}
        />
        <ModalContent>
          <Form.MaxWidth>
            <Paragraphe>
              <StyledBody>
                {t`Pour sécuriser l'accès à ton pass nous avons besoin de valider ton numéro.`}
              </StyledBody>
            </Paragraphe>
            <Spacer.Column numberOfSpaces={8} />
            <InputContainer>
              <StyledCountryPicker initialCountry={INITIAL_COUNTRY} onSelect={setCountry} />
              <StyledTextInput
                autoCapitalize="none"
                isError={false}
                keyboardType="number-pad"
                onChangeText={onChangeText}
                placeholder={getPlaceholder(country.cca2)}
                textContentType="telephoneNumber"
                onSubmitEditing={requestSendPhoneValidationCode}
                {...accessibilityAndTestId(t`Entrée pour le numéro de téléphone`)}
                aria-describedby={phoneNumberInputErrorId}
              />
            </InputContainer>
            {invalidPhoneNumberMessage ? (
              <React.Fragment>
                <InputError
                  relatedInputId={phoneNumberInputErrorId}
                  visible
                  messageId={invalidPhoneNumberMessage}
                  numberOfSpacesTop={3}
                />
                <Spacer.Column numberOfSpaces={5} />
              </React.Fragment>
            ) : (
              <Spacer.Column numberOfSpaces={8} />
            )}
            <ButtonPrimary
              wording={getButtonTitle()}
              disabled={!isContinueButtonEnabled}
              onPress={requestSendPhoneValidationCode}
              isLoading={isLoading}
            />
          </Form.MaxWidth>
        </ModalContent>
      </BottomContentPage>
      <QuitSignupModal
        visible={quitSignupModalVisible}
        resume={hideQuitSignupModal}
        testIdSuffix="phone-number-quit-signup"
        signupStep={SignupStep.PhoneNumber}
      />
    </React.Fragment>
  )
})

const ModalContent = styled.View(({ theme }) => ({
  paddingTop: getSpacing(7),
  alignItems: 'center',
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))

const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})

const InputContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: getSpacing(90),
  marginHorizontal: theme.isMobileViewport ? undefined : 'auto',
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const PICKER_WIDTH_DESKTOP = 30 // in %
const PICKER_WIDTH_MOBILE = 35 // in %
const INPUT_WIDTH_DESKTOP = 100 - PICKER_WIDTH_DESKTOP // in %
const INPUT_WIDTH_MOBILE = 100 - PICKER_WIDTH_MOBILE // in %

const StyledCountryPicker = styled(CountryPicker)(({ theme }) => ({
  width: theme.isDesktopViewport ? `${PICKER_WIDTH_DESKTOP}%` : `${PICKER_WIDTH_MOBILE}%`,
}))

const StyledTextInput = styled(TextInput).attrs((props) => {
  const { theme } = props
  return {
    containerStyle: {
      width: theme.isDesktopViewport ? `${INPUT_WIDTH_DESKTOP}%` : `${INPUT_WIDTH_MOBILE}%`,
    },
  }
})({})

/**
 * 6 to 10 digits
 */
function isValidPhoneNumber(word: string) {
  return word.match(/^\d{6,10}$/)
}

function formatPhoneNumber(phoneNumber: string) {
  if (phoneNumber.startsWith('0')) {
    return phoneNumber.substring(1)
  }
  return phoneNumber
}
