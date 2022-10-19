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
  TextComponent: React.FC
  CTAComponent: React.FC
  hideModal: () => void
}

export const AppBottomSheetModal: FunctionComponent<Props> = ({
  visible,
  title,
  Illustration,
  TextComponent,
  CTAComponent,
  hideModal,
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
        <TextComponent />
        <Spacer.Column numberOfSpaces={6} />
        <CTAComponent />
      </Container>
    </AppModal>
  )
}

const Container = styled.View({
  alignItems: 'center',
  width: '100%',
})
