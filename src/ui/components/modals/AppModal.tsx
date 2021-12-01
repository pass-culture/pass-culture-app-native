import React, { FunctionComponent, useRef, useState, useMemo } from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'
import RNModal from 'react-native-modal'
import styled from 'styled-components/native'

import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { getSpacing, UniqueColors } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ModalHeader } from './ModalHeader'
import { ModalIconProps } from './types'

type Props = {
  title: string
  visible: boolean
  titleNumberOfLines?: number
  disableBackdropTap?: boolean
  shouldDisplayOverlay?: boolean
  onBackdropPress?: () => void
} & ModalIconProps

// Without this, modal-enhanced-react-native-web recompute the margin with arbitraty values
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
  disableBackdropTap,
  shouldDisplayOverlay = true,
  onBackdropPress,
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

  function handleOnBackdropPress() {
    if (disableBackdropTap) {
      return undefined
    }
    return onBackdropPress ?? onLeftIconPress ?? onRightIconPress
  }

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
  return (
    <StyledModal
      style={modalStyles}
      supportedOrientations={['portrait', 'landscape']}
      statusBarTranslucent
      hasBackdrop={shouldDisplayOverlay}
      backdropColor={UniqueColors.GREY_OVERLAY}
      isVisible={visible}
      onBackdropPress={handleOnBackdropPress()}
      testID="modal"
      height={modalHeight}
      deviceHeight={windowHeight}
      deviceWidth={windowWidth}>
      <ModalHeader
        title={title}
        numberOfLines={titleNumberOfLines}
        onLayout={({ nativeEvent }) => {
          setHeaderHeight(nativeEvent.layout.height)
        }}
        {...iconProps}
      />
      <SpacerBetweenHeaderAndContent />
      <ScrollViewContainer paddingBottom={scrollViewPaddingBottom}>
        <ScrollView
          ref={scrollViewRef}
          scrollEnabled={true}
          onContentSizeChange={(_width, height) => {
            setScrollViewContentHeight(height)
            scrollViewRef.current?.scrollTo({ y: 0 })
          }}>
          {children}
        </ScrollView>
      </ScrollViewContainer>
    </StyledModal>
  )
}

const SPACE_BETWEEN_HEADER_AND_CONTENT = getSpacing(5)
const SpacerBetweenHeaderAndContent = styled.View({
  height: SPACE_BETWEEN_HEADER_AND_CONTENT,
})

const ScrollViewContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  flex: 1,
  maxWidth: getSpacing(120),
  paddingBottom,
}))

const MODAL_PADDING = getSpacing(5)
// @ts-ignore Argument of type 'typeof ReactNativeModal' is not assignable to parameter of type 'AnyStyledComponent'
const StyledModal = styled(RNModal)<{ height: number }>(({ height, theme }) => {
  const { isDesktopViewport, appContentWidth, colors } = theme
  return {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
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
    top: isDesktopViewport ? 0 : 'auto',
    borderBottomStartRadius: isDesktopViewport ? getSpacing(4) : 0,
    borderBottomEndRadius: isDesktopViewport ? getSpacing(4) : 0,
    borderBottomRightRadius: isDesktopViewport ? 20 : 0,
    borderBottomLeftRadius: isDesktopViewport ? 20 : 0,
  }
})
