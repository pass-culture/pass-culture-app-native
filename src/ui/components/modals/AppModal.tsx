import React, { FunctionComponent, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import RNModal from 'react-native-modal'
import styled from 'styled-components/native'

import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { Style } from 'ui/components/Style'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, UniqueColors } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ModalHeader } from './ModalHeader'
import { ModalStyles, useModalStyles } from './useModalStyles'

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

export const AppModal: FunctionComponent<Props> = ({
  height,
  maxWidth,
  layout,
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
  const styles = useModalStyles({
    layout: layout || 'bottom',
    height,
    maxWidth,
  })
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
      <RNModal
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent
        hasBackdrop={shouldDisplayOverlay}
        backdropColor={UniqueColors.GREY_OVERLAY}
        isVisible={visible}
        onBackdropPress={handleOnBackdropPress()}
        style={[styles.container, styles.topOffset]}
        testID="modal">
        <ClicAwayArea
          activeOpacity={1}
          onPress={disableBackdropTap ? undefined : onRightIconPress}
          testID="click-away-area">
          <Container activeOpacity={1}>
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
          </Container>
        </ClicAwayArea>
      </RNModal>
    </React.Fragment>
  )
}

const ClicAwayArea = styled(TouchableOpacity)({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  height: '100%',
  width: '100%',
})

const Container = styled(TouchableOpacity)({
  flexDirection: 'column',
  backgroundColor: ColorsEnum.WHITE,
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  maxHeight: '90%',
  borderTopStartRadius: getSpacing(4),
  borderTopEndRadius: getSpacing(4),
  padding: getSpacing(5),
})

const Content = styled.View({
  paddingTop: getSpacing(5),
  width: '100%',
  alignItems: 'center',
  maxWidth: getSpacing(125),
})

const StyledScrollView = styled(ScrollView)({ width: '100%' })
