import React, { FunctionComponent } from 'react'
import { Modal, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ModalOverlay } from 'ui/components/modals/ModalOverlay'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

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
}) => {
  const { bottom } = useCustomSafeInsets()
  return (
    <React.Fragment>
      <ModalOverlay visible={visible} />
      <Modal
        animationType="slide"
        statusBarTranslucent
        transparent={true}
        visible={visible}
        testID="modal">
        <ClicAwayArea activeOpacity={1} onPress={onRightIconPress}>
          <Container activeOpacity={1}>
            <ModalHeader
              title={title}
              leftIcon={leftIcon}
              onLeftIconPress={onLeftIconPress}
              rightIcon={rightIcon}
              onRightIconPress={onRightIconPress}
            />
            <Content style={{ paddingBottom: bottom }}>{children}</Content>
          </Container>
        </ClicAwayArea>
      </Modal>
    </React.Fragment>
  )
}

const ClicAwayArea = styled(TouchableOpacity)({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height: '100%',
  width: '100%',
})

const Container = styled(TouchableOpacity)({
  flexDirection: 'column',
  backgroundColor: ColorsEnum.WHITE,
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  borderTopStartRadius: getSpacing(4),
  borderTopEndRadius: getSpacing(4),
  padding: getSpacing(5),
})

const Content = styled.View({
  paddingTop: getSpacing(5),
  width: '100%',
  alignItems: 'center',
  maxWidth: getSpacing(125),
})
