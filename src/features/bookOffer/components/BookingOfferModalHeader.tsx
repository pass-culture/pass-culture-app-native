import React from 'react'
import styled from 'styled-components/native'

import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

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

const HeaderContainer = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.xl,
  paddingBottom: theme.designSystem.size.spacing.s,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  width: '100%',
}))
