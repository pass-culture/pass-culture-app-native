import React, { FunctionComponent, ReactNode } from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ModalIconProps } from 'ui/components/modals/types'
import { useEscapeKeyAction } from 'ui/hooks/useEscapeKeyAction'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  title: string
  visible: boolean
  titleNumberOfLines?: number
  fixedBottomChildren?: ReactNode
} & ModalIconProps

// Without this, the margin is recomputed with arbitraty values
const modalStyles = { margin: 'auto' }

export const CookieConsentModal: FunctionComponent<Props> = ({
  title,
  visible,
  leftIconAccessibilityLabel,
  leftIcon,
  onLeftIconPress,
  rightIconAccessibilityLabel,
  rightIcon,
  onRightIconPress,
  fixedBottomChildren,
  titleNumberOfLines,
  children,
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

  useEscapeKeyAction(visible ? onRightIconPress : undefined)

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
        <ModalHeader
          title={title}
          numberOfLines={titleNumberOfLines}
          titleID={titleId}
          {...iconProps}
        />
        {!!children && (
          <ChildrenContainer>
            <ScrollView>{children}</ScrollView>
          </ChildrenContainer>
        )}
        {!!fixedBottomChildren && (
          <ChildrenContainer>
            <FixedBottomChildrenView>{fixedBottomChildren}</FixedBottomChildrenView>
          </ChildrenContainer>
        )}
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
  const { isDesktopViewport, appContentWidth, colors } = theme
  const desktopModalMaxHeight = windowHeight - windowHeight * 0.25
  return {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomStartRadius: isDesktopViewport ? getSpacing(4) : 0,
    borderBottomEndRadius: isDesktopViewport ? getSpacing(4) : 0,
    borderBottomRightRadius: isDesktopViewport ? 20 : 0,
    borderBottomLeftRadius: isDesktopViewport ? 20 : 0,
    borderTopStartRadius: getSpacing(4),
    borderTopEndRadius: getSpacing(4),
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    maxHeight: isDesktopViewport ? desktopModalMaxHeight : windowHeight,
    maxWidth: isDesktopViewport ? getSpacing(130) : appContentWidth,
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

const ChildrenContainer = styled.View({
  marginTop: getSpacing(5),
  width: '100%',
})
