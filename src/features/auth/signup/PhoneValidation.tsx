import React, { useState } from 'react'

import { useAppSettings } from 'features/auth/settings'
import { SetPhoneNumberModal } from 'features/auth/signup/SetPhoneNumberModal'
import { SetPhoneValidationCodeModal } from 'features/auth/signup/SetPhoneValidationCodeModal'
import { useModal } from 'ui/components/modals/useModal'
import { Background } from 'ui/svg/Background'

export const PhoneValidation: React.FC = function () {
  const { data: settings } = useAppSettings()
  const [phoneNumber, setPhoneNumber] = useState('')
  const {
    visible: phoneNumberModalVisible,
    showModal: showPhoneNumberModal,
    hideModal: hidePhoneNumberModal,
  } = useModal(settings?.enablePhoneValidation)

  const {
    visible: phoneValidationModalVisible,
    showModal: showPhoneValidationModal,
    hideModal: hidePhoneValidationModal,
  } = useModal(false)

  function onValidationCodeAsked() {
    hidePhoneNumberModal()
    showPhoneValidationModal()
  }

  function goBackOnSetPhoneNumber() {
    showPhoneNumberModal()
    hidePhoneValidationModal()
  }

  return (
    <React.Fragment>
      <Background />
      <SetPhoneNumberModal
        visible={phoneNumberModalVisible}
        dismissModal={hidePhoneNumberModal}
        onChangePhoneNumber={setPhoneNumber}
        onValidationCodeAsked={onValidationCodeAsked}
        phoneNumber={phoneNumber}
      />
      <SetPhoneValidationCodeModal
        visible={phoneValidationModalVisible}
        dismissModal={hidePhoneValidationModal}
        phoneNumber={phoneNumber}
        onGoBack={goBackOnSetPhoneNumber}
      />
    </React.Fragment>
  )
}
