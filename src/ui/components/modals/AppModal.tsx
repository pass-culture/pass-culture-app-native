import React, { FunctionComponent } from 'react'
import { Modal, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

import { ModalHeader } from './ModalHeader'

interface Props {
  title: string
  visible: boolean
  leftIcon?: FunctionComponent<IconInterface>
  onLeftIconPress?: () => void
  rightIcon?: FunctionComponent<IconInterface>
  onRightIconPress?: () => void
}

export const AppModal: FunctionComponent<Props> = ({
  title,
  visible,
  leftIcon,
  onLeftIconPress,
  rightIcon,
  onRightIconPress,
  children,
}) => (
  <Modal animationType="slide" statusBarTranslucent transparent={true} visible={visible}>
    <TouchableWithoutFeedback onPress={onRightIconPress}>
      <Overlay>
        <TouchableWithoutFeedback>
          <Container>
            <ModalHeader
              title={title}
              leftIcon={leftIcon}
              onLeftIconPress={onLeftIconPress}
              rightIcon={rightIcon}
              onRightIconPress={onRightIconPress}
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
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  padding: 20,
})

const Content = styled.View({
  paddingTop: 20,
  width: '100%',
})
