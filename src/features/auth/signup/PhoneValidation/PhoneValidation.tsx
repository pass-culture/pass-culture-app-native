import React, { useState } from 'react'

import { SetPhoneNumberModal } from 'features/auth/signup/PhoneValidation/SetPhoneNumberModal'
import { SetPhoneValidationCodeModal } from 'features/auth/signup/PhoneValidation/SetPhoneValidationCodeModal'
import { useModal } from 'ui/components/modals/useModal'
import { Background } from 'ui/svg/Background'

// TODO(PC-9271) replace SetPhoneNumberModal and SetPhoneValidationCodeModal by BottomContentPages
export const PhoneValidation: React.FC = function () {
  const [phoneNumber, setPhoneNumber] = useState('')
  const {
    visible: phoneNumberModalVisible,
    showModal: showPhoneNumberModal,
    hideModal: hidePhoneNumberModal,
  } = useModal(true)

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
