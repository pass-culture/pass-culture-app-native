import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorInfo } from 'ui/svg/icons/BicolorInfo'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

interface Props {
  visible: boolean
  hideModal: VoidFunction
}

export const BookingCloseInformation = ({ visible, hideModal }: Props) => {
  const theme = useTheme()
  return (
    <AppInformationModal
      visible={visible}
      title="Réservation en cours"
      numberOfLinesTitle={2}
      onCloseIconPress={hideModal}>
      <React.Fragment>
        <Spacer.Column numberOfSpaces={getSpacing(1)} />
        <BicolorInfo size={theme.illustrations.sizes.medium} />
        <Spacer.Column numberOfSpaces={getSpacing(2)} />
        <ModalBodyText>
          En quittant la réservation, elle ne sera pas annulée{LINE_BREAK}
          {LINE_BREAK}Si elle est éligible à une annulation, tu pourras lʼannuler depuis lʼonglet
          “Réservations”
        </ModalBodyText>
        <Spacer.Column numberOfSpaces={getSpacing(2)} />
        <ButtonPrimary
          wording="J’ai compris"
          accessibilityLabel="J’ai compris, je ferme la pop-up "
          onPress={hideModal}
        />
      </React.Fragment>
    </AppInformationModal>
  )
}

const ModalBodyText = styled(Typo.Body)({
  textAlign: 'center',
})
