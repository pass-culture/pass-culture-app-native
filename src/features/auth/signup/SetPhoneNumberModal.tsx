import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Animated } from 'react-native'
import CountryPicker, {
  Country,
  CountryCode,
  DEFAULT_THEME,
} from 'react-native-country-picker-modal'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { ApiError, extractApiErrorMessage } from 'api/helpers'
import { useSendPhoneValidationMutation } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { currentTimestamp } from 'libs/dates'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'
import { useTimer, TIMER_NOT_INITIALIZED } from 'libs/timer'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export interface SetPhoneNumberModalProps {
  visible: boolean
  dismissModal: () => void
  onChangePhoneNumber: (value: string) => void
  onValidationCodeAsked: () => void
  phoneNumber: string
}

const TIMER = 60
const ALLOWED_COUNTRY_CODES: CountryCode[] = [
  'FR',
  'MQ',
  'YT',
  'GP',
  'GF',
  'RE',
  'PM',
  'BL',
  'MF',
  'WF',
  'PF',
  'NC',
]

export const SetPhoneNumberModal = (props: SetPhoneNumberModalProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber)
  const [invalidPhoneNumberMessage, setInvalidPhoneNumberMessage] = useSafeState('')
  const [validationCodeRequestTimestamp, setValidationCodeRequestTimestamp] = useState<
    null | number
  >(null)
  const [countryCode, setCountryCode] = useState<CountryCode>('FR')
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState('33')
  const [shouldCountryPickerBeVisible, setShouldCountryPickerBeVisible] = useState(false)
  const {
    visible: quitSignupModalVisible,
    showModal: showQuitSignupModal,
    hideModal: hideQuitSignupModal,
  } = useModal(false)

  const timeSinceLastRequest = useTimer(
    validationCodeRequestTimestamp,
    (elapsedTime: number) => elapsedTime > TIMER
  )
  const isRequestTimestampExpired =
    !validationCodeRequestTimestamp ||
    timeSinceLastRequest === TIMER_NOT_INITIALIZED ||
    timeSinceLastRequest >= TIMER

  const isPhoneValid = Boolean(isValidPhoneNumber(phoneNumber))

  useEffect(() => {
    storage.readObject('phone_validation_code_asked_at').then((value) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValidationCodeRequestTimestamp(value as any)
    })
  }, [])

  function onSuccess() {
    const now = currentTimestamp()
    storage.saveObject('phone_validation_code_asked_at', now)
    setValidationCodeRequestTimestamp(now)
    props.onValidationCodeAsked()
  }

  function onError(error: ApiError | unknown) {
    const { content } = error as ApiError
    if (content.code === 'TOO_MANY_SMS_SENT') {
      props.dismissModal()
      navigate('PhoneValidationTooManyAttempts')
    } else {
      const message = extractApiErrorMessage(error)
      setInvalidPhoneNumberMessage(message)
    }
  }

  const { mutate: sendPhoneValidationCode } = useSendPhoneValidationMutation({
    onSuccess,
    onError,
  })

  function requestSendPhoneValidationCode() {
    if (isRequestTimestampExpired) {
      setInvalidPhoneNumberMessage('')
      const phoneNumberWithPrefix = '+' + phoneNumberPrefix + formatPhoneNumber(phoneNumber)
      sendPhoneValidationCode(phoneNumberWithPrefix)
      props.onChangePhoneNumber(phoneNumberWithPrefix)
    }
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

  function onSelectCountryCode(country: Country) {
    setCountryCode(country.cca2)
    setPhoneNumberPrefix(country.callingCode[0])
  }

  function openCountryPickerModal() {
    setShouldCountryPickerBeVisible(true)
  }
  function closeCountryPickerModal() {
    setShouldCountryPickerBeVisible(false)
  }

  return (
    <AppModal
      visible={props.visible}
      title={t`Confirme ton numéro`}
      rightIcon={Close}
      onRightIconPress={showQuitSignupModal}
      disableBackdropTap
      shouldDisplayOverlay={false}>
      <ModalContent>
        <Paragraphe>
          <Typo.Body color={ColorsEnum.GREY_DARK}>
            {t`Pour sécuriser l'accès à ton pass nous avons besoin de valider ton numéro.`}
          </Typo.Body>
        </Paragraphe>
        <Spacer.Column numberOfSpaces={8} />
        <PhoneNumberInput>
          <TouchableOpacity onPress={openCountryPickerModal}>
            <CountryPicker
              countryCode={countryCode}
              countryCodes={ALLOWED_COUNTRY_CODES}
              onSelect={onSelectCountryCode}
              translation={'fra'}
              theme={{
                ...DEFAULT_THEME,
                fontFamily: 'Montserrat-Bold',
                fontSize: getSpacing(3.75),
              }}
              withCallingCode
              withCallingCodeButton
              modalProps={{ visible: shouldCountryPickerBeVisible }}
              onClose={closeCountryPickerModal}
            />
          </TouchableOpacity>
          <Spacer.Row numberOfSpaces={2} />
          <Animated.View
            style={{ transform: [{ rotateZ: `${Math.PI / 2}rad` }] }}
            testID="accordionArrow">
            <TouchableOpacity onPress={openCountryPickerModal}>
              <ArrowNext size={getSpacing(6)} />
            </TouchableOpacity>
          </Animated.View>
          <Spacer.Row numberOfSpaces={2} />
          <TextInput
            autoCapitalize="none"
            isError={false}
            keyboardType="number-pad"
            onChangeText={onChangeText}
            placeholder={t`6 12 34 56 78`}
            textContentType="telephoneNumber"
          />
        </PhoneNumberInput>
        {invalidPhoneNumberMessage ? (
          <React.Fragment>
            <InputError visible messageId={invalidPhoneNumberMessage} numberOfSpacesTop={3} />
            <Spacer.Column numberOfSpaces={5} />
          </React.Fragment>
        ) : (
          <Spacer.Column numberOfSpaces={8} />
        )}
        <ButtonPrimary
          title={getButtonTitle()}
          disabled={!isContinueButtonEnabled}
          onPress={requestSendPhoneValidationCode}
        />
      </ModalContent>
      <QuitSignupModal
        visible={quitSignupModalVisible}
        resume={hideQuitSignupModal}
        signupStep={SignupSteps.PhoneNumber}
      />
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
  alignItems: 'center',
  paddingHorizontal: getSpacing(2),
})

const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})

const PhoneNumberInput = styled.View({
  flexDirection: 'row',
  paddingHorizontal: getSpacing(14),
  alignItems: 'center',
})

/**
 * - contains 9 digits
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
