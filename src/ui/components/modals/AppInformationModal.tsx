import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { Modal, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

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
  const { bottom } = useSafeAreaInsets()
  const paddingBottom = Math.max(bottom, getSpacing(3))
  const modalId = uuidv4()
  return (
    <React.Fragment>
      {!!visible && (
        <Modal
          animationType="fade"
          statusBarTranslucent
          transparent={true}
          visible={visible}
          testID={`modal-${testIdSuffix}`}>
          <ClicAwayArea activeOpacity={1} onPress={onCloseIconPress}>
            <Spacer.Flex />
            <Container activeOpacity={1} aria-describedby={modalId}>
              <ModalHeader
                title={title}
                boldTitle
                leftIconAccessibilityLabel={undefined}
                leftIcon={undefined}
                onLeftIconPress={undefined}
                rightIconAccessibilityLabel={t`Fermer la modale`}
                rightIcon={Close}
                onRightIconPress={onCloseIconPress}
                numberOfLines={numberOfLinesTitle}
                accessibilityDescribedBy={modalId}
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

const ClicAwayArea = styled(TouchableOpacity)(({ theme }) => ({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height: '100%',
  width: '100%',
  backgroundColor: theme.uniqueColors.greyOverlay,
}))

const Container = styled(TouchableOpacity)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  alignItems: 'center',
  alignSelf: 'center',
  borderRadius: getSpacing(4),
  padding: getSpacing(5),
  width: theme.isMobileViewport
    ? theme.appContentWidth - getSpacing(8)
    : theme.breakpoints.sm - getSpacing(3),
}))

const Content = styled.View(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  maxWidth: theme.contentPage.maxWidth,
}))
