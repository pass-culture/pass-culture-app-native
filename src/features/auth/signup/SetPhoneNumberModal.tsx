import { t } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { useSendPhoneValidationMutation } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { currentTimestamp } from 'libs/dates'
import { storage } from 'libs/storage'
import { useTimer } from 'libs/timer'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

interface SetPhoneNumberModalProps {
  visible: boolean
  dismissModal: () => void
  onChangePhoneNumber: (value: string) => void
  onValidationCodeAsked: () => void
  phoneNumber: string
}

const TIMER = 60

export const SetPhoneNumberModal = (props: SetPhoneNumberModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber)
  const [validationCodeRequestTimestamp, setValidationCodeRequestTimestamp] = useState<
    null | number
  >(null)
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
    !validationCodeRequestTimestamp || timeSinceLastRequest === 0 || timeSinceLastRequest >= TIMER

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

  const { mutate: sendPhoneValidationCode } = useSendPhoneValidationMutation({
    onSuccess,
    onError: (_error: unknown) => {
      // TODO(8702) display error message in a toaster
    },
  })

  function requestSendPhoneValidationCode() {
    if (isRequestTimestampExpired) {
      sendPhoneValidationCode(phoneNumber)
    }
  }

  function onChangeText(value: string) {
    setPhoneNumber(value)
    props.onChangePhoneNumber(value)
  }

  const isContinueButtonEnabled = isRequestTimestampExpired && isPhoneValid

  function getButtonTitle() {
    if (isRequestTimestampExpired) return t`Continuer`
    const remainingTime = TIMER - timeSinceLastRequest
    return t`Attends` + ` ${remainingTime}s.`
  }

  return (
    <AppModal
      visible={props.visible}
      title={t`Confirme ton numéro`}
      rightIcon={Close}
      onRightIconPress={showQuitSignupModal}
      disableBackdropTap>
      <ModalContent>
        <Paragraphe>
          <Typo.Body color={ColorsEnum.GREY_DARK}>
            {t`Pour sécuriser l'accès à ton pass nous avons besoin de valider ton numéro.`}
          </Typo.Body>
        </Paragraphe>
        <Spacer.Column numberOfSpaces={8} />
        <StyledInput>
          <Typo.Body color={ColorsEnum.BLACK}>{t`Numéro de téléphone`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <TextInput
            autoCapitalize="none"
            isError={false}
            keyboardType="number-pad"
            onChangeText={onChangeText}
            placeholder={t`0612345678`}
            textContentType="telephoneNumber"
            value={phoneNumber}
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary
          title={getButtonTitle()}
          disabled={!isContinueButtonEnabled}
          testIdSuffix="continue"
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
  paddingHorizontal: 8,
})

const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})

/**
 * - starts with 0
 * - contains 10 digits
 */
function isValidPhoneNumber(word: string) {
  return word.match(/^0[0-9]{9}$/g)
}
