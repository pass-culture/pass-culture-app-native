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
    <React.Fragment>
      {!!visible && (
        <Modal
          animationType="fade"
          statusBarTranslucent
          transparent={true}
          visible={visible}
          testID={`modal-${testIdSuffix}`}
          onRequestClose={onCloseIconPress}>
          <ClicAwayArea onPress={onCloseIconPress} />
          <FlexSpacer />
          <Container aria-labelledby={titleID}>
            <ModalHeader
              title={title}
              titleID={titleID}
              boldTitle
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
      )}
    </React.Fragment>
  )
}

const ClicAwayArea = styled(TouchableOpacity)(({ theme }) => ({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  position: 'absolute',
  height: '100%',
  width: '100%',
  backgroundColor: theme.uniqueColors.greyOverlay,
}))

const Container = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.white,
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
