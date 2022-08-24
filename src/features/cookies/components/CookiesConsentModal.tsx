import React, { FunctionComponent, ReactNode } from 'react'
import { useWindowDimensions } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { appModalContainerStyle } from 'ui/components/modals/appModalContainerStyle'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ModalIconProps } from 'ui/components/modals/types'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  title: string
  visible: boolean
  fixedBottomChildren: ReactNode
} & ModalIconProps

// Without this, the margin is recomputed with arbitraty values
const modalStyles = { margin: 'auto' }

export const CookiesConsentModal: FunctionComponent<Props> = ({
  title,
  visible,
  leftIconAccessibilityLabel,
  leftIcon,
  onLeftIconPress,
  rightIconAccessibilityLabel,
  rightIcon,
  onRightIconPress,
  children,
  fixedBottomChildren,
}) => {
  const iconProps = {
    rightIconAccessibilityLabel,
    rightIcon,
    onRightIconPress,
    leftIconAccessibilityLabel,
    leftIcon,
    onLeftIconPress,
  } as ModalIconProps

  const { height: windowHeight, width: windowWidth } = useWindowDimensions()

  const titleId = uuidv4()

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
        <ModalHeader title={title} titleID={titleId} {...iconProps} />
        <Spacer.Column numberOfSpaces={5} />
        {!!children && <StyledScrollView>{children}</StyledScrollView>}
        <FixedBottomChildrenView>{fixedBottomChildren}</FixedBottomChildrenView>
        <Spacer.BottomScreen />
      </ModalContainer>
    </StyledModal>
  )
}

// @ts-ignore Argument of type 'typeof ReactNativeModal' is not assignable to parameter of type 'Any<StyledComponent>'
const StyledModal = styled(ReactNativeModal)<{ height: number }>(({ theme }) => {
  const { isDesktopViewport } = theme
  return {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    top: isDesktopViewport ? 0 : 'auto',
    alignItems: 'center',
  }
})

const ModalContainer = styled.View<{ windowHeight: number }>(({ windowHeight, theme }) => {
  const desktopMaxHeight = windowHeight * 0.75
  return appModalContainerStyle({
    theme,
    desktopMaxHeight,
    maxHeight: windowHeight,
  })
})

const SCROLLBAR_SPACING = getSpacing(4)
// Hack to shift the scrollbar
const StyledScrollView = styled.ScrollView({
  paddingHorizontal: SCROLLBAR_SPACING,
  marginHorizontal: -SCROLLBAR_SPACING,
})

const FixedBottomChildrenView = styled.View(({ theme }) => ({
  marginTop: getSpacing(5),
  backgroundColor: theme.colors.white,
  width: '100%',
  alignItems: 'center',
}))
