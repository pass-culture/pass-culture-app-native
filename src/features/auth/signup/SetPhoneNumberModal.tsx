import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

interface SetPhoneNumberModalProps {
  visible: boolean
  dismissModal: () => void
}

export const SetPhoneNumberModal = (props: SetPhoneNumberModalProps) => {
  const {
    visible: quitSignupModalVisible,
    showModal: showQuitSignupModal,
    hideModal: hideQuitSignupModal,
  } = useModal(props.visible)

  return (
    <AppModal
      visible={props.visible}
      title={t`Confirme ton numéro`}
      rightIcon={Close}
      onRightIconPress={showQuitSignupModal}
      disableBackdropTap
      isScrollable>
      <ModalContent>
        <Paragraphe>
          <Typo.Body>{t`Pour sécuriser l'accès à ton pass nous avons besoin de valider ton numéro.`}</Typo.Body>
        </Paragraphe>
        <Spacer.Column numberOfSpaces={6} />

        {/* Input */}
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary title={t`Continuer`} />
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
})

const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})
