import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Button } from 'ui/designSystem/Button/Button'
import { Info } from 'ui/svg/icons/Info'
import { Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

interface Props {
  visible: boolean
  hideModal: VoidFunction
}

export const BookingCloseInformation = ({ visible, hideModal }: Props) => {
  const { illustrations, designSystem } = useTheme()
  return (
    <AppInformationModal
      visible={visible}
      title="Réservation en cours"
      numberOfLinesTitle={2}
      onCloseIconPress={hideModal}>
      <React.Fragment>
        <Spacer.Column numberOfSpaces={designSystem.size.spacing.xs} />
        <Info size={illustrations.sizes.medium} color={designSystem.color.icon.brandPrimary} />
        <ModalBodyText>
          En quittant la réservation, elle ne sera pas annulée{LINE_BREAK}
          {LINE_BREAK}Si elle est éligible à une annulation, tu pourras lʼannuler depuis lʼonglet
          “Réservations”
        </ModalBodyText>
        <Button
          wording="J’ai compris"
          accessibilityLabel="J’ai compris, je ferme la pop-up "
          onPress={hideModal}
          fullWidth
        />
      </React.Fragment>
    </AppInformationModal>
  )
}

const ModalBodyText = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginVertical: theme.designSystem.size.spacing.xxl,
}))
