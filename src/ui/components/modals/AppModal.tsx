import React, { FunctionComponent, useRef, useState, useMemo } from 'react'
import { ScrollView, useWindowDimensions, View, StyleSheet } from 'react-native'
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

const defaultModalStyles = {
  spacing: getSpacing(1),
  height: getSpacing(112),
  maxWidth: getSpacing(125),
  layout: undefined,
}

export interface ModalStyles {
  layout?: 'bottom'
  height?: number
  maxWidth?: number
  spacing?: number
}

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
  const { height: windowHeight, width: windowWidth } = useWindowDimensions()

  const useModalStyles = (modalStyles: ModalStyles) => {
    const { layout, spacing, height, maxWidth } = { ...defaultModalStyles, ...modalStyles }
    return useMemo(
      () =>
        StyleSheet.create({
          topOffset: {
            ...(layout === 'bottom'
              ? {
                  position: 'absolute',
                  height,
                  margin: 'auto',
                  bottom: 0,
                }
              : {}),
          },
          topInset: {
            ...(layout === 'bottom'
              ? {
                  marginTop: 0,
                }
              : {}),
          },
          container: {
            maxWidth,
            ...(layout === 'bottom'
              ? {
                  marginBottom: 0,
                  marginRight: 0,
                  marginLeft: 0,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                }
              : {
                  marginHorizontal: 'auto',
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }),
            flexDirection: 'column',
            backgroundColor: ColorsEnum.WHITE,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            borderTopStartRadius: getSpacing(4),
            borderTopEndRadius: getSpacing(4),
            padding: getSpacing(6),
          },
          contentContainer: {},
          modaleIcon: {
            marginTop: 20,
          },
        }),
      [layout, spacing, height, maxWidth]
    )
  }
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
        // TODO : remove stylesheet and use styledcomponents
        style={[styles.container, styles.topOffset]}
        testID="modal"
        deviceHeight={windowHeight}
        deviceWidth={windowWidth}>
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
      </RNModal>
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
