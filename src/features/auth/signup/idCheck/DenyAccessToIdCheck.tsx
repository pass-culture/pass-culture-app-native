import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { ColorsEnum, Spacer, getSpacing, Typo } from 'ui/theme'

interface DenyAccessToIdCheckModalProps {
  visible: boolean
  dismissModal: () => void
}

export const DenyAccessToIdCheckModal = (props: DenyAccessToIdCheckModalProps) => {
  const { showSuccessSnackBar } = useSnackBarContext()

  const onGetAlertedPress = () => {
    props.dismissModal()
    showSuccessSnackBar({
      message: t`Email enregistré. Tu seras averti lors du retour du service.`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  return (
    <AppModal
      visible={props.visible}
      title={t`Oops !`}
      rightIcon={Close}
      onRightIconPress={props.dismissModal}
      isScrollable>
      <ModalContent>
        <HappyFace size={getSpacing(20)} color={ColorsEnum.GREY_DARK} />
        <Spacer.Column numberOfSpaces={getSpacing(2)} />
        <Paragraphe>
          <Typo.Body color={ColorsEnum.GREY_DARK}>
            {t`Merci, ta demande pour bénéficier des 300€ a bien été prise en compte. Vous êtes très nombreux à solliciter le service. Active la notification pour être informé du suivi de ton dossier.`}
          </Typo.Body>
        </Paragraphe>
        <Spacer.Column numberOfSpaces={getSpacing(2)} />
        <ButtonPrimary
          title={t`Recevoir une alerte`}
          testIdSuffix="continue"
          onPress={onGetAlertedPress}
        />
      </ModalContent>
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
