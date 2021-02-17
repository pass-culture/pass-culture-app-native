import React, { FunctionComponent } from 'react'
import { Modal, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { ModalOverlay } from 'ui/components/modals/ModalOverlay'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { ModalHeader } from './ModalHeader'

interface Props {
  title: string
  visible: boolean
  onCloseIconPress?: () => void
  testIdSuffix?: string
}

export const AppInformationModal: FunctionComponent<Props> = ({
  title,
  visible,
  children,
  onCloseIconPress,
  testIdSuffix,
}) => {
  const { bottom } = useSafeAreaInsets()
  const paddingBottom = Math.max(bottom, getSpacing(3))
  return (
    <React.Fragment>
      <ModalOverlay visible={visible} />
      {visible && (
        <Modal
          animationType="slide"
          statusBarTranslucent
          transparent={true}
          visible={visible}
          testID={`modal-${testIdSuffix}`}>
          <ClicAwayArea activeOpacity={1} onPress={onCloseIconPress}>
            <Spacer.Flex />
            <Container activeOpacity={1}>
              <ModalHeader
                title={title}
                rightIcon={Close}
                onRightIconPress={onCloseIconPress}
                boldTitle
              />
              <Content style={{ paddingBottom: paddingBottom }}>{children}</Content>
            </Container>
            <Spacer.Flex />
          </ClicAwayArea>
        </Modal>
      )}
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
  backgroundColor: ColorsEnum.WHITE,
  alignItems: 'center',
  alignSelf: 'center',
  width: '90%',
  borderRadius: getSpacing(4),
  padding: getSpacing(5),
})

const Content = styled.View({
  width: '100%',
  alignItems: 'center',
  maxWidth: getSpacing(125),
})
