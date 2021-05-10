import React, { useState } from 'react'

import { SetPhoneNumberModal } from 'features/auth/signup/SetPhoneNumberModal'
import { SetPhoneNumberValidationCodeModal } from 'features/auth/signup/SetPhoneNumberValidationCodeModal'
import { useModal } from 'ui/components/modals/useModal'

export const TemporaryIdCheck: React.FC = function () {
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
      <SetPhoneNumberModal
        visible={phoneNumberModalVisible}
        dismissModal={hidePhoneNumberModal}
        onChangePhoneNumber={setPhoneNumber}
        onValidationCodeAsked={onValidationCodeAsked}
        phoneNumber={phoneNumber}
      />
      <SetPhoneNumberValidationCodeModal
        visible={phoneValidationModalVisible}
        dismissModal={hidePhoneValidationModal}
        phoneNumber={phoneNumber}
        onGoBack={goBackOnSetPhoneNumber}
      />
    </React.Fragment>
  )
}
