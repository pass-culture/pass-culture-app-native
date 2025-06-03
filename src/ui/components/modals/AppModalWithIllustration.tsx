import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppModal } from 'ui/components/modals/AppModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Close } from 'ui/svg/icons/Close'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Props = {
  children: React.ReactNode
  visible: boolean
  title: string
  Illustration: React.FC<AccessibleIcon>
  hideModal: () => void
  onModalHide?: () => void
}

export const AppModalWithIllustration: FunctionComponent<Props> = ({
  visible,
  title,
  Illustration,
  hideModal,
  onModalHide,
  children,
}) => {
  return (
    <AppModal
      visible={visible}
      title={title}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={hideModal}
      onModalHide={onModalHide}>
      <Container gap={6}>
        <Illustration />
        {children}
      </Container>
    </AppModal>
  )
}

const Container = styled(ViewGap)({
  alignItems: 'center',
  width: '100%',
})
