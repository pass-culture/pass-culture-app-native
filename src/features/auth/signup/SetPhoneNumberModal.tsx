import { t } from '@lingui/macro'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

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
  const [phoneNumber, setPhoneNumber] = useState('')

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
            onChangeText={setPhoneNumber}
            placeholder={t`0612345678`}
            textContentType="telephoneNumber"
            value={phoneNumber}
          />
        </StyledInput>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary
          title={t`Continuer`}
          disabled={!isValidPhoneNumber(phoneNumber)}
          testIdSuffix="continue"
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
