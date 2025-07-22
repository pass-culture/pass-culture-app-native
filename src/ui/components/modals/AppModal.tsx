import React, { FunctionComponent, useRef, useState, useMemo, useCallback } from 'react'
import {
  LayoutChangeEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  ViewProps,
} from 'react-native'
import { ReactNativeModal } from 'react-native-modal'
import { CSSObject } from 'styled-components'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'
import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { appModalContainerStyle } from 'ui/components/modals/appModalContainerStyle'
// eslint-disable-next-line no-restricted-imports
import { ModalSpacing } from 'ui/components/modals/enum'
import { useEscapeKeyAction } from 'ui/hooks/useEscapeKeyAction'
import { getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ModalHeader } from './ModalHeader'
import { ModalIconProps, ModalSwipeDirection } from './types'

type Props = {
  animationOutTiming?: number
  title: string
  visible: boolean
  titleNumberOfLines?: number
  shouldDisplayOverlay?: boolean
  scrollEnabled?: boolean
  onBackdropPress?: () => void
  onModalHide?: () => void
  customModalHeader?: React.JSX.Element
  fixedModalBottom?: React.JSX.Element
  isFullscreen?: boolean
  noPadding?: boolean
  noPaddingBottom?: boolean
  modalSpacing?: ModalSpacing
  maxHeight?: number
  shouldScrollToEnd?: boolean
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps']
  shouldAddSpacerBetweenHeaderAndContent?: boolean
  testID?: string
  isUpToStatusBar?: boolean
  children: React.ReactNode
  onSwipe?: () => void
  swipeDirection?: ModalSwipeDirection
  propagateSwipe?: boolean
  desktopConstraints?: CSSObject
} & ModalIconProps &
  Pick<ViewProps, 'onLayout'>

// Without this, the margin is recomputed with arbitrary values
const styles = StyleSheet.create({ modal: { margin: 'auto' } })

const DESKTOP_FULLSCREEN_RATIO = 0.75

export const AppModal: FunctionComponent<Props> = ({
  animationOutTiming,
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
  onModalHide,
  scrollEnabled = true,
  isFullscreen,
  noPadding,
  noPaddingBottom,
  customModalHeader,
  fixedModalBottom,
  modalSpacing,
  maxHeight,
  shouldScrollToEnd,
  keyboardShouldPersistTaps,
  shouldAddSpacerBetweenHeaderAndContent = true,
  testID = 'modal',
  isUpToStatusBar,
  onSwipe,
  swipeDirection,
  propagateSwipe,
  onLayout,
  desktopConstraints,
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
  const { bottom, top } = useCustomSafeInsets()
  const { isSmallScreen, modal, isDesktopViewport } = useTheme()

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(300)
  const [headerHeight, setHeaderHeight] = useState(50)
  const scrollViewRef = useRef<ScrollView | null>(null)
  const fullscreenScrollViewRef = useRef<ScrollView | null>(null)

  const getDesktopMaxHeight = useCallback(() => {
    if (isFullscreen || isUpToStatusBar) {
      return windowHeight * DESKTOP_FULLSCREEN_RATIO
    }
    return maxHeight ? maxHeight * DESKTOP_FULLSCREEN_RATIO : undefined
  }, [isFullscreen, isUpToStatusBar, windowHeight, maxHeight])

  const containerDesktopConstraints = useMemo(() => {
    if (isDesktopViewport) {
      return {
        maxWidth: desktopConstraints?.maxWidth ?? modal.desktopMaxWidth,
        maxHeight: desktopConstraints?.maxHeight ?? getDesktopMaxHeight(),
      }
    }
    return undefined
  }, [isDesktopViewport, desktopConstraints, modal.desktopMaxWidth, getDesktopMaxHeight])

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

  const onContentSizeChangeFullscreenModal = useCallback(() => {
    if (!shouldScrollToEnd) return
    fullscreenScrollViewRef.current?.scrollToEnd()
  }, [shouldScrollToEnd])

  const setFullscreenScrollViewRef = useCallback((ref: ScrollView | null) => {
    fullscreenScrollViewRef.current = ref
  }, [])

  const titleId = uuidv4()

  useEscapeKeyAction(visible ? onRightIconPress : undefined)

  let maxContainerHeight = maxHeight
  let modalContainerHeight = isSmallScreen ? windowHeight : modalHeight

  // no fullscreen in desktop view
  if (isFullscreen || isUpToStatusBar) {
    maxContainerHeight = windowHeight
    modalContainerHeight = isUpToStatusBar ? windowHeight - top : windowHeight
  }

  const fullscreenModalBody = useMemo(() => {
    return scrollEnabled ? (
      <StyledScrollView
        modalSpacing={modalSpacing}
        testID="fullscreenModalScrollView"
        ref={setFullscreenScrollViewRef}
        onContentSizeChange={onContentSizeChangeFullscreenModal}
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
        {children}
      </StyledScrollView>
    ) : (
      <StyledView modalSpacing={modalSpacing} testID="fullscreenModalView">
        {children}
      </StyledView>
    )
  }, [
    children,
    keyboardShouldPersistTaps,
    modalSpacing,
    onContentSizeChangeFullscreenModal,
    scrollEnabled,
    setFullscreenScrollViewRef,
  ])

  return (
    <StyledModal
      accessibilityModal
      animationOutTiming={animationOutTiming}
      style={styles.modal}
      supportedOrientations={['portrait', 'landscape']}
      statusBarTranslucent
      hasBackdrop={shouldDisplayOverlay}
      isVisible={visible}
      onBackdropPress={onBackdropPress ?? onLeftIconPress ?? onRightIconPress}
      testID={testID}
      deviceHeight={windowHeight}
      deviceWidth={windowWidth}
      accessibilityLabelledBy={titleId}
      onModalHide={onModalHide}
      onSwipeComplete={onSwipe}
      swipeDirection={swipeDirection}
      propagateSwipe={propagateSwipe}>
      <StatusBar barStyle="light-content" translucent />
      <ModalContainer
        height={maxHeight ? undefined : modalContainerHeight}
        testID="modalContainer"
        maxHeight={maxContainerHeight}
        desktopConstraints={containerDesktopConstraints}
        onLayout={onLayout}
        noPadding={noPadding}
        noPaddingBottom={noPaddingBottom}>
        {customModalHeader ? (
          <CustomModalHeaderContainer nativeID={titleId} testID="customModalHeader">
            {customModalHeader}
          </CustomModalHeaderContainer>
        ) : (
          <ModalHeader
            title={title}
            numberOfLines={titleNumberOfLines}
            onLayout={updateHeaderHeight}
            titleID={titleId}
            modalSpacing={modalSpacing}
            {...iconProps}
          />
        )}
        {isFullscreen || maxHeight || isUpToStatusBar ? (
          fullscreenModalBody
        ) : (
          <React.Fragment>
            {shouldAddSpacerBetweenHeaderAndContent ? (
              <SpacerBetweenHeaderAndContent testID="spacerBetweenHeaderAndContent" />
            ) : null}
            <ScrollViewContainer
              paddingBottom={scrollViewPaddingBottom}
              modalSpacing={modalSpacing}>
              <ScrollView
                contentContainerStyle={fixedModalBottom ? undefined : contentContainerStyle}
                ref={scrollViewRef}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={updateScrollViewContentHeight}
                testID="modalScrollView">
                {children}
              </ScrollView>
            </ScrollViewContainer>
          </React.Fragment>
        )}
        {fixedModalBottom ? (
          <React.Fragment>
            <FixedModalBottomContainer testID="fixedModalBottom">
              {fixedModalBottom}
            </FixedModalBottomContainer>
            <Spacer.BottomScreen />
          </React.Fragment>
        ) : null}
      </ModalContainer>
    </StyledModal>
  )
}

const contentContainerStyle = Platform.select({
  default: {},
  web: isDesktopDeviceDetectOnWeb
    ? {
        // solve the outline focus issue due to scrollView, see PC-13996
        paddingVertical: 5,
        paddingHorizontal: 10,
      }
    : {},
})

const SPACE_BETWEEN_HEADER_AND_CONTENT = getSpacing(5)
const SpacerBetweenHeaderAndContent = styled.View({
  height: SPACE_BETWEEN_HEADER_AND_CONTENT,
})

const ScrollViewContainer = styled.View.attrs<{ backdropColor?: string }>(({ theme }) => ({
  backdropColor: theme.designSystem.color.background.overlay,
}))<{ paddingBottom: number; modalSpacing?: ModalSpacing }>(({ paddingBottom, modalSpacing }) => ({
  width: '100%', // do not use `flex: 1` here if you want full width
  maxWidth: getSpacing(120),
  maxHeight: '100%',
  paddingBottom,
  ...(modalSpacing ? { paddingHorizontal: modalSpacing } : {}),
}))

const MODAL_PADDING = getSpacing(5)
// https://github.com/react-native-modal/react-native-modal/issues/381
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledModal = styled(ReactNativeModal as any)(({ theme }) => {
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

const MAX_HEIGHT = 650
const ModalContainer = styled.View<{
  height?: number
  desktopConstraints?: CSSObject
  maxHeight?: number
  noPadding?: boolean
  noPaddingBottom?: boolean
}>(({ height, desktopConstraints, maxHeight, noPadding, theme, noPaddingBottom }) => {
  return appModalContainerStyle({
    theme,
    height,
    desktopConstraints,
    maxHeight: maxHeight ?? MAX_HEIGHT,
    noPadding,
    noPaddingBottom,
  })
})

const StyledScrollView = styled(ScrollView)<{
  modalSpacing?: ModalSpacing
}>(({ modalSpacing }) => ({
  width: '100%',
  ...(modalSpacing ? { paddingHorizontal: modalSpacing } : {}),
}))

const StyledView = styled.View<{
  modalSpacing?: ModalSpacing
}>(({ modalSpacing }) => ({
  width: '100%',
  flex: 1,
  ...(modalSpacing ? { paddingHorizontal: modalSpacing } : {}),
}))

const CustomModalHeaderContainer = styled.View({
  flexDirection: 'row',
  width: '100%',
})

const FixedModalBottomContainer = styled.View({
  width: '100%',
})
