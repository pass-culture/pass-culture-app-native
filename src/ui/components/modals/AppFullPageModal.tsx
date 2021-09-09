import React, { FunctionComponent } from 'react'
import { Modal, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

interface Props {
  visible: boolean
  testIdSuffix?: string
}

export const AppFullPageModal: FunctionComponent<Props> = ({ visible, children, testIdSuffix }) => {
  return visible ? (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent={true}
      visible={visible}
      testID={`modal-${testIdSuffix}`}>
      <Container activeOpacity={1}>{children}</Container>
    </Modal>
  ) : null
}

const Container = styled(TouchableOpacity)({
  alignItems: 'center',
  alignSelf: 'center',
  width: '100%',
})
