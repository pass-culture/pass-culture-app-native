import React, { FunctionComponent, useRef, useState } from 'react'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import RNModal from 'react-native-modal'
import styled from 'styled-components/native'

import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { Style } from 'ui/components/Style'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, UniqueColors, ColorsEnum } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ModalHeader } from './ModalHeader'

interface Props extends ModalStyles {
  title: string
  visible: boolean
  leftIcon?: FunctionComponent<IconInterface>
  onLeftIconPress?: () => void
  rightIcon?: FunctionComponent<IconInterface>
  onRightIconPress: () => void
  titleNumberOfLines?: number
  isScrollable?: boolean
  disableBackdropTap?: boolean
  shouldDisplayOverlay?: boolean
  onBackdropPress?: () => void
}

const webcss = `div[aria-modal="true"] { align-items: center }`

export interface ModalStyles {
  height?: number
  maxWidth?: number
}

export const AppModal: FunctionComponent<Props> = ({
  height,
  maxWidth,
  title,
  visible,
  leftIcon,
  onLeftIconPress,
  rightIcon,
  onRightIconPress,
  children,
  titleNumberOfLines,
  isScrollable = false,
  disableBackdropTap,
  shouldDisplayOverlay = true,
  onBackdropPress,
}) => {
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
        deviceWidth={windowWidth}
        maxWidth={maxWidth}
        height={height}>
        <ModalHeader
          title={title}
          leftIcon={leftIcon}
          onLeftIconPress={onLeftIconPress}
          rightIcon={rightIcon}
          onRightIconPress={onRightIconPress}
          numberOfLines={titleNumberOfLines}
        />

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
