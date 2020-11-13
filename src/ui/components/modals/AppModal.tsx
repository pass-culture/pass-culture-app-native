import React, { FunctionComponent, useEffect, useState } from 'react'
import { Animated, Easing, Modal, Platform, TouchableOpacity, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing } from 'ui/theme'
import { UniqueColors } from 'ui/theme/colors'

import { ModalHeader } from './ModalHeader'

interface Props {
  title: string
  visible: boolean
  leftIcon?: FunctionComponent<IconInterface>
  onLeftIconPress?: () => void
  rightIcon?: FunctionComponent<IconInterface>
  onRightIconPress?: () => void
}

export const AppModal: FunctionComponent<Props> = ({
  title,
  visible,
  leftIcon,
  onLeftIconPress,
  rightIcon,
  onRightIconPress,
  children,
}) => (
  <React.Fragment>
    <OverlayComponent visible={visible} />
    <Modal animationType="slide" statusBarTranslucent transparent={true} visible={visible}>
      <ClicAwayArea activeOpacity={1} onPress={onRightIconPress}>
        <Container activeOpacity={1}>
          <ModalHeader
            title={title}
            leftIcon={leftIcon}
            onLeftIconPress={onLeftIconPress}
            rightIcon={rightIcon}
            onRightIconPress={onRightIconPress}
          />
          <Content>{children}</Content>
        </Container>
      </ClicAwayArea>
    </Modal>
  </React.Fragment>
)

const ClicAwayArea = styled(TouchableOpacity)({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height: '100%',
  width: '100%',
})

const OverlayComponent: FunctionComponent<ViewProps & { visible: boolean }> = (props) => {
  const [opacity] = useState(new Animated.Value(0))
  const [isDisplayed, setIsDisplayed] = useState(props.visible)

  useEffect(() => {
    if (props.visible) {
      setIsDisplayed(true)
      Animated.timing(opacity, {
        duration: 300,
        toValue: 1,
        easing: Easing.linear,
        useNativeDriver: Platform.OS == 'android',
      }).start()
    }

    if (!props.visible) {
      Animated.timing(opacity, {
        duration: 300,
        toValue: 0,
        useNativeDriver: Platform.OS == 'android',
      }).start(() => setIsDisplayed(false))
    }
  }, [props.visible])

  return isDisplayed ? <AnimatedOverlay opacity={opacity} /> : null
}

const AnimatedOverlay = styled(Animated.View)<{ opacity: Animated.Value }>({
  flex: 1,
  position: 'absolute',
  top: 0,
  height: '100%',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  backgroundColor: UniqueColors.GREY_OVERLAY,
})

const Container = styled(TouchableOpacity)({
  flexDirection: 'column',
  backgroundColor: ColorsEnum.WHITE,
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
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
