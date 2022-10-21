import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'

type Props = {
  visible: boolean
  title: string
  Illustration: React.FC<AccessibleIcon>
  hideModal: () => void
}

export const AppModalWithIllustration: FunctionComponent<Props> = ({
  visible,
  title,
  Illustration,
  hideModal,
  children,
}) => {
  return (
    <AppModal
      visible={visible}
      title={title}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={hideModal}>
      <Container>
        <Illustration />
        <Spacer.Column numberOfSpaces={6} />
        {children}
      </Container>
    </AppModal>
  )
}

const Container = styled.View({
  alignItems: 'center',
  width: '100%',
})
