import React, { FunctionComponent, ReactNode } from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ModalHeader } from 'features/cookies/atoms/ModalHeader'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useEscapeKeyAction } from 'ui/hooks/useEscapeKeyAction'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  title: string
  visible: boolean
  fixedBottomChildren?: ReactNode
  onGoBackPress?: () => void
  onClosePress: () => void
  headerRigthButton?: ReactNode
}

// Without this, the margin is recomputed with arbitraty values
const modalStyles = { margin: 'auto' }

export const CookiesConsentModal: FunctionComponent<Props> = ({
  title,
  visible,
  children,
  fixedBottomChildren,
  headerRigthButton,
  onGoBackPress,
  onClosePress,
}) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions()

  const titleId = uuidv4()

  useEscapeKeyAction(visible ? onClosePress : undefined)

  return (
    <StyledModal
      style={modalStyles}
      supportedOrientations={['portrait', 'landscape']}
      statusBarTranslucent
      hasBackdrop
      isVisible={visible}
      testID="cookieModal"
      deviceHeight={windowHeight}
      deviceWidth={windowWidth}
      aria-labelledby={titleId}
      accessibilityRole={AccessibilityRole.DIALOG}
      aria-modal={true}>
      <ModalContainer windowHeight={windowHeight}>
        <ModalHeader title={title} onGoBackPress={onGoBackPress} rightButton={headerRigthButton} />
        {!!children && <ScrollView>{children}</ScrollView>}
        {!!fixedBottomChildren && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={5} />
            <FixedBottomChildrenView>{fixedBottomChildren}</FixedBottomChildrenView>
          </React.Fragment>
        )}
        <Spacer.BottomScreen />
      </ModalContainer>
    </StyledModal>
  )
}

// @ts-ignore Argument of type 'typeof ReactNativeModal' is not assignable to parameter of type 'Any<StyledComponent>'
const StyledModal = styled(ReactNativeModal)<{ height: number }>(({ theme }) => {
  return {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    top: theme.isDesktopViewport ? 0 : 'auto',
    alignItems: 'center',
  }
})

const ModalContainer = styled.View<{ windowHeight: number }>(({ windowHeight, theme }) => {
  const { isDesktopViewport, appContentWidth, colors } = theme
  const desktopModalMaxHeight = windowHeight - windowHeight * 0.25
  const borderBottomVertical = isDesktopViewport ? getSpacing(4) : 0
  const borderBottomHorizontal = isDesktopViewport ? 20 : 0
  const maxHeight = isDesktopViewport ? desktopModalMaxHeight : windowHeight
  const maxWidth = isDesktopViewport ? getSpacing(130) : appContentWidth
  return {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomStartRadius: borderBottomVertical,
    borderBottomEndRadius: borderBottomVertical,
    borderBottomRightRadius: borderBottomHorizontal,
    borderBottomLeftRadius: borderBottomHorizontal,
    borderTopStartRadius: getSpacing(4),
    borderTopEndRadius: getSpacing(4),
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    maxHeight,
    maxWidth,
    padding: getSpacing(6),
    paddingBottom: getSpacing(8),
    width: '100%',
  }
})

const FixedBottomChildrenView = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.white,
  width: '100%',
  alignItems: 'center',
}))
