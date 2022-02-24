import React, { FunctionComponent, useRef, useState, useMemo, useCallback } from 'react'
import { LayoutChangeEvent, ScrollView, useWindowDimensions } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { useEscapeKeyAction } from 'ui/hooks/useEscapeKeyAction'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ModalHeader } from './ModalHeader'
import { ModalIconProps } from './types'

type Props = {
  title: string
  visible: boolean
  titleNumberOfLines?: number
  shouldDisplayOverlay?: boolean
  scrollEnabled?: boolean
  onBackdropPress?: () => void
} & ModalIconProps

// Without this, the margin is recomputed with arbitraty values
const modalStyles = { margin: 'auto' }

export const AppModal: FunctionComponent<Props> = ({
  title,
  visible,
  leftIconAccessibilityLabel,
  leftIcon,
  onLeftIconPress,
  rightIconAccessibilityLabel,
  rightIcon,
  onRightIconPress,
  children,
  titleNumberOfLines,
  shouldDisplayOverlay = true,
  onBackdropPress,
  scrollEnabled = true,
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
  const { bottom } = useCustomSafeInsets()

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(300)
  const [headerHeight, setHeaderHeight] = useState(50)
  const scrollViewRef = useRef<ScrollView | null>(null)

  useKeyboardEvents({
    onBeforeShow(data) {
      setKeyboardHeight(data.keyboardHeight)
    },
    onBeforeHide() {
      setKeyboardHeight(0)
    },
  })

  const scrollViewPaddingBottom = keyboardHeight || bottom
  const modalHeight = useMemo(() => {
    const SMALL_BUFFER_TO_AVOID_UNNECESSARY_SCROLL = 10
    return (
      scrollViewContentHeight +
      scrollViewPaddingBottom +
      headerHeight +
      SPACE_BETWEEN_HEADER_AND_CONTENT +
      2 * MODAL_PADDING +
      SMALL_BUFFER_TO_AVOID_UNNECESSARY_SCROLL
    )
  }, [scrollViewContentHeight, scrollViewPaddingBottom, headerHeight])

  const updateHeaderHeight = useCallback(
    ({ nativeEvent }: LayoutChangeEvent): void => {
      setHeaderHeight(nativeEvent.layout.height)
    },
    [setHeaderHeight]
  )

  const updateScrollViewContentHeight = useCallback(
    (_width: number, height: number): void => {
      setScrollViewContentHeight(height)
      scrollViewRef.current?.scrollTo({ y: 0 })
    },
    [setScrollViewContentHeight, scrollViewRef]
  )

  const modalId = uuidv4()

  useEscapeKeyAction(visible ? onRightIconPress : undefined)

  return (
    <StyledModal
      style={modalStyles}
      supportedOrientations={['portrait', 'landscape']}
      statusBarTranslucent
      hasBackdrop={shouldDisplayOverlay}
      isVisible={visible}
      onBackdropPress={onBackdropPress ?? onLeftIconPress ?? onRightIconPress}
      testID="modal"
      deviceHeight={windowHeight}
      deviceWidth={windowWidth}>
      <ModalContainer height={modalHeight} testID="modalContainer" aria-describedby={modalId}>
        <ModalHeader
          title={title}
          numberOfLines={titleNumberOfLines}
          onLayout={updateHeaderHeight}
          accessibilityDescribedBy={modalId}
          {...iconProps}
        />
        <SpacerBetweenHeaderAndContent />
        <ScrollViewContainer paddingBottom={scrollViewPaddingBottom}>
          <ScrollView
            ref={scrollViewRef}
            scrollEnabled={scrollEnabled}
            onContentSizeChange={updateScrollViewContentHeight}
            testID="modalScrollView">
            {children}
          </ScrollView>
        </ScrollViewContainer>
      </ModalContainer>
    </StyledModal>
  )
}

const SPACE_BETWEEN_HEADER_AND_CONTENT = getSpacing(5)
const SpacerBetweenHeaderAndContent = styled.View({
  height: SPACE_BETWEEN_HEADER_AND_CONTENT,
})

const ScrollViewContainer = styled.View.attrs(({ theme }) => ({
  backdropColor: theme.uniqueColors.greyOverlay,
}))<{ paddingBottom: number }>(({ paddingBottom }) => ({
  width: '100%', // do not use `flex: 1` here if you want full width
  maxWidth: getSpacing(120),
  paddingBottom,
}))

const MODAL_PADDING = getSpacing(5)
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

const ModalContainer = styled.View<{ height: number }>(({ height, theme }) => {
  const { isDesktopViewport, appContentWidth, colors } = theme
  return {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: colors.white,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 650,
    height,
    width: '100%',
    borderTopStartRadius: getSpacing(4),
    borderTopEndRadius: getSpacing(4),
    padding: MODAL_PADDING,
    maxWidth: isDesktopViewport ? getSpacing(130) : appContentWidth,
    borderBottomStartRadius: isDesktopViewport ? getSpacing(4) : 0,
    borderBottomEndRadius: isDesktopViewport ? getSpacing(4) : 0,
    borderBottomRightRadius: isDesktopViewport ? 20 : 0,
    borderBottomLeftRadius: isDesktopViewport ? 20 : 0,
  }
})
