import React, { FunctionComponent } from 'react'
import { Modal, ScrollView, StyleSheet, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Close } from 'ui/svg/icons/Close'

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
  const { height: windowHeight } = useWindowDimensions()
  const titleID = uuidv4()
  const adaptedNumberOfLinesTitle = useMobileFontScaleToDisplay({
    default: numberOfLinesTitle,
    at200PercentZoom: undefined,
  })

  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent
      visible={visible}
      testID={testIdSuffix ? `modal-${testIdSuffix}` : undefined}
      onRequestClose={onCloseIconPress}>
      <ClickAwayArea onPress={onCloseIconPress} />
      <ModalCenteredContent>
        <Container accessibilityLabelledBy={titleID} gap={6} maxHeight={windowHeight * 0.8}>
          <ModalHeader
            title={title}
            titleID={titleID}
            rightIconAccessibilityLabel="Fermer la modale"
            rightIcon={Close}
            onRightIconPress={onCloseIconPress}
            numberOfLines={adaptedNumberOfLinesTitle}
          />
          <Content
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator
            bounces={false}
            testID="appInformationModalScrollView">
            {children}
          </Content>
        </Container>
      </ModalCenteredContent>
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

const Container = styled(ViewGap)<{ maxHeight: number }>(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  alignItems: 'center',
  alignSelf: 'center',
  maxHeight: '100%',
  borderRadius: theme.designSystem.size.borderRadius.s,
  padding: theme.designSystem.size.spacing.xl,
  paddingBottom: theme.designSystem.size.spacing.xxl,
  width: theme.isMobileViewport
    ? theme.appContentWidth - theme.designSystem.size.spacing.xxl
    : theme.breakpoints.sm - theme.designSystem.size.spacing.m,
}))

const Content = styled(ScrollView)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
  flexGrow: 0,
}))

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
  },
})

const ModalCenteredContent = styled.View({
  height: '100%',
  justifyContent: 'center',
})
