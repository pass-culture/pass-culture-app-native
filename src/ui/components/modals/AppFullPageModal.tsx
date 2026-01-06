import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'
import styled from 'styled-components/native'

interface Props {
  visible: boolean
  testIdSuffix?: string
  onRequestClose: () => void
  children: React.ReactNode
}

export const AppFullPageModal: FunctionComponent<Props> = ({
  visible,
  children,
  testIdSuffix,
  onRequestClose,
}) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions()
  const testId = testIdSuffix ? `modal-${testIdSuffix}` : undefined

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      useNativeDriver
      coverScreen
      backdropOpacity={0}
      deviceHeight={windowHeight}
      deviceWidth={windowWidth}
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      testID={testId}>
      <Container>{children}</Container>
    </Modal>
  )
}

const Container = styled.View(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
    maxWidth: theme.appContentWidth,
  }
})

// https://github.com/react-native-modal/react-native-modal/issues/381
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Modal = styled(ReactNativeModal as any)({
  margin: 0,
})
