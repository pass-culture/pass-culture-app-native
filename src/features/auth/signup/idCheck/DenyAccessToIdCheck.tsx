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
      title={t`Oups\u00a0!`}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer la modale`}
      rightIcon={Close}
      onRightIconPress={props.dismissModal}>
      <ModalContent>
        <HappyFace size={getSpacing(20)} color={ColorsEnum.GREY_DARK} />
        <Spacer.Column numberOfSpaces={getSpacing(2)} />
        <Paragraphe>
          <Typo.Body color={ColorsEnum.GREY_DARK}>
            {t`Vous êtes actuellement très nombreux à vouloir effectuer votre demande des 300\u00a0€. Tu recevras une alerte par mail pour commencer ta demande des 300\u00a0€ dès que le service sera de nouveau disponible\u00a0!`}
          </Typo.Body>
        </Paragraphe>
        <Spacer.Column numberOfSpaces={getSpacing(2)} />
        <ButtonPrimary title={t`Recevoir une alerte`} onPress={onGetAlertedPress} />
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
