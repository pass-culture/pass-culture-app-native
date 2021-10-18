import React, { FunctionComponent, useRef, useState } from 'react'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import RNModal from 'react-native-modal'
import styled, { useTheme } from 'styled-components/native'

import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { Style } from 'ui/components/Style'
import { getSpacing, UniqueColors, ColorsEnum } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ModalHeader } from './ModalHeader'
import { ModalIconProps } from './types'

const webcss = `div[aria-modal="true"] { align-items: center }`

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

  const { height: windowHeight } = useWindowDimensions()
  const { appContentWidth } = useTheme()
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
    <React.Fragment>
      <Style>{webcss}</Style>
      <StyledModal
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent
        hasBackdrop={shouldDisplayOverlay}
        backdropColor={UniqueColors.GREY_OVERLAY}
        isVisible={visible}
        onBackdropPress={handleOnBackdropPress()}
        testID="modal"
        deviceHeight={windowHeight}
        deviceWidth={appContentWidth}
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
    </React.Fragment>
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
  ({ maxWidth, height }) => ({
    position: 'absolute',
    height,
    margin: 'auto',
    bottom: 0,
    maxWidth,
    marginBottom: 0,
    marginRight: 0,
    marginLeft: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    backgroundColor: ColorsEnum.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderTopStartRadius: getSpacing(4),
    borderTopEndRadius: getSpacing(4),
    padding: getSpacing(6),
  })
)
