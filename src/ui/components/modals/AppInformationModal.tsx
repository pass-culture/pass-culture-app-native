import React, { FunctionComponent } from 'react'
import { Modal } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer } from 'ui/theme'

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
      <Container accessibilityLabelledBy={titleID}>
        <ModalHeader
          title={title}
          titleID={titleID}
          rightIconAccessibilityLabel="Fermer la modale"
          rightIcon={Close}
          onRightIconPress={onCloseIconPress}
          numberOfLines={numberOfLinesTitle}
        />
        <Spacer.Column numberOfSpaces={6} />
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
  backgroundColor: theme.uniqueColors.greyOverlay,
}))

const Container = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  alignItems: 'center',
  alignSelf: 'center',
  borderRadius: getSpacing(4),
  padding: getSpacing(6),
  paddingBottom: getSpacing(8),
  width: theme.isMobileViewport
    ? theme.appContentWidth - getSpacing(8)
    : theme.breakpoints.sm - getSpacing(3),
}))

const Content = styled.View(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  maxWidth: theme.contentPage.maxWidth,
}))

const FlexSpacer = styled(Spacer.Flex)(({ theme }) => ({
  zIndex: theme.zIndex.background,
}))
