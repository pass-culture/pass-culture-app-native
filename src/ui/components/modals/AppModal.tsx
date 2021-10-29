import React, { FunctionComponent, useRef, useState } from 'react'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import RNModal from 'react-native-modal'
import styled from 'styled-components/native'

import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { getSpacing, UniqueColors } from 'ui/theme'
import { ZIndex } from 'ui/theme/layers'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ModalHeader } from './ModalHeader'
import { ModalIconProps } from './types'

export interface ModalStyles {
  height?: number
  maxWidth?: number
}

type Props = {
  title: string
  visible: boolean
  titleNumberOfLines?: number
  isScrollable?: boolean
  disableBackdropTap?: boolean
  shouldDisplayOverlay?: boolean
  onBackdropPress?: () => void
} & ModalIconProps &
  ModalStyles

// Without this, modal-enhanced-react-native-web use display: flex which can't be centered with align-self: center
// and it also recompute the margin, preventing it from keeping it's bottom: 0 position
const modalStyles = { flex: 1, margin: 0 }

export const AppModal: FunctionComponent<Props> = ({
  height,
  maxWidth,
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
  isScrollable = false,
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
      deviceHeight={windowHeight}
      deviceWidth={windowWidth}
      maxWidth={maxWidth}
      height={height}>
      <ModalHeader title={title} numberOfLines={titleNumberOfLines} {...iconProps} />
      <Content style={{ paddingBottom: keyboardHeight || bottom }}>
        {isScrollable ? (
          <StyledScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollViewRef.current !== null && scrollViewRef.current.scrollTo({ y: 0 })
            }
            contentContainerStyle={{ paddingVertical: getSpacing(2) }}>
            <View onStartShouldSetResponder={() => true}>{children}</View>
          </StyledScrollView>
        ) : (
          children
        )}
      </Content>
    </StyledModal>
  )
}

const Content = styled.View({
  paddingTop: getSpacing(5),
  width: '100%',
  alignItems: 'center',
  maxWidth: getSpacing(125),
})

const StyledScrollView = styled(ScrollView)({ width: '100%' })

// @ts-ignore RNModal extends React.Component
const StyledModal = styled(RNModal)<{ maxWidth: number; height: number }>(
  ({ maxWidth, height, theme }) => ({
    position: 'absolute',
    height,
    bottom: 0,
    marginTop: 'auto',
    marginBottom: 0,
    maxWidth: maxWidth ?? theme.appContentWidth,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    borderTopStartRadius: getSpacing(4),
    borderTopEndRadius: getSpacing(4),
    padding: getSpacing(6),
    zIndex: ZIndex.APP_MODAL,
  })
)
