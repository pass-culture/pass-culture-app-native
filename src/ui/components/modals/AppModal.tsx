import React, { FunctionComponent } from 'react'
import { Modal, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native'

import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum } from 'ui/theme'

import { ModalHeader } from './ModalHeader'

interface Props {
  title: string
  visible: boolean
  onClose?: () => void
  onBackNavigation?: () => void
}

export const AppModal: FunctionComponent<Props> = ({
  title,
  visible,
  onClose,
  onBackNavigation,
  children,
}) => (
  <Modal animationType="slide" statusBarTranslucent transparent={true} visible={visible}>
    <TouchableWithoutFeedback onPress={onClose}>
      <Overlay>
        <TouchableWithoutFeedback>
          <Container>
            <ModalHeader
              title={title}
              leftIcon={ArrowPrevious}
              onLeftIconPress={onBackNavigation}
              rightIcon={Close}
              onRightIconPress={onClose}
            />
            <Content>{children}</Content>
          </Container>
        </TouchableWithoutFeedback>
      </Overlay>
    </TouchableWithoutFeedback>
  </Modal>
)

const Overlay = styled.View({
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
})

const Container = styled.View({
  flexDirection: 'column',
  backgroundColor: ColorsEnum.WHITE,
  justifyContent: 'flex-start',
  alignItems: 'center',
  minHeight: 300,
  width: '100%',
  borderTopStartRadius: 16,
  borderTopEndRadius: 16,
  paddingVertical: 20,
})

const Content = styled.View({
  padding: 20,
})
