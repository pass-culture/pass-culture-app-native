import React, { FunctionComponent } from 'react'
import { Modal, useWindowDimensions } from 'react-native'
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
  const { height: windowHeight } = useWindowDimensions()
  const testId = testIdSuffix ? `modal-${testIdSuffix}` : undefined

  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
      testID={testId}>
      <WebContainer windowHeight={windowHeight}>{children}</WebContainer>
    </Modal>
  )
}

const WebContainer = styled.View<{ windowHeight: number }>(({ windowHeight, theme }) => {
  const maxHeight = windowHeight - theme.navTopHeight
  return {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    maxWidth: theme.appContentWidth,
    maxHeight: theme.isMobileViewport ? '100%' : maxHeight,
    backgroundColor: theme.designSystem.color.background.default,
  }
})
