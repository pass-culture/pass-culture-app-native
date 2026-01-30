import React, { FunctionComponent } from 'react'
import { Modal } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

import { ModalHeader } from './ModalHeader'

interface Props {
  title: string
  numberOfLinesTitle?: number
  visible: boolean
  onCloseIconPress: () => void
  testIdSuffix?: string
  children: React.ReactNode
}

export const AppInformationModal: FunctionComponent<Props> = ({
  title,
  numberOfLinesTitle,
  visible,
  children,
  onCloseIconPress,
  testIdSuffix,
}) => {
  const titleID = uuidv4()
  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent
      visible={visible}
      testID={testIdSuffix ? `modal-${testIdSuffix}` : undefined}
      onRequestClose={onCloseIconPress}>
      <ClickAwayArea onPress={onCloseIconPress} />
      <FlexSpacer />
      <Container accessibilityLabelledBy={titleID} gap={6}>
        <ModalHeader
          title={title}
          titleID={titleID}
          rightIconAccessibilityLabel="Fermer la modale"
          rightIcon={Close}
          onRightIconPress={onCloseIconPress}
          numberOfLines={numberOfLinesTitle}
        />
        <Content>{children}</Content>
      </Container>
      <FlexSpacer />
    </Modal>
  )
}

const ClickAwayArea = styled(TouchableOpacity).attrs({ activeOpacity: 1 })(({ theme }) => ({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  position: 'absolute',
  height: '100%',
  width: '100%',
  backgroundColor: theme.designSystem.color.background.overlay,
}))

const Container = styled(ViewGap)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  alignItems: 'center',
  alignSelf: 'center',
  borderRadius: theme.designSystem.size.borderRadius.s,
  padding: theme.designSystem.size.spacing.xl,
  paddingBottom: theme.designSystem.size.spacing.xxl,
  width: theme.isMobileViewport
    ? theme.appContentWidth - theme.designSystem.size.spacing.xxl
    : theme.breakpoints.sm - theme.designSystem.size.spacing.m,
}))

const Content = styled.View(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  maxWidth: theme.contentPage.maxWidth,
}))

const FlexSpacer = styled(Spacer.Flex)(({ theme }) => ({
  zIndex: theme.zIndex.background,
}))
