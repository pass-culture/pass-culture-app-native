import React from 'react'
import styled from 'styled-components/native'

import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  modalLeftIconProps: ModalLeftIconProps
  onClose: VoidFunction
  title: string
}

export const BookingOfferModalHeader = ({ modalLeftIconProps, onClose, title }: Props) => {
  return (
    <HeaderContainer>
      <ModalHeader
        title={title}
        {...modalLeftIconProps}
        rightIconAccessibilityLabel="Fermer la modale"
        rightIcon={Close}
        onRightIconPress={onClose}
      />
      <Spacer.Column numberOfSpaces={4} />
    </HeaderContainer>
  )
}

const HeaderContainer = styled.View({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(2),
  paddingHorizontal: getSpacing(6),
  width: '100%',
})
