import React, { FunctionComponent, useEffect, useState } from 'react'
import { Animated, Easing, Modal, Platform, TouchableOpacity, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum, getSpacing } from 'ui/theme'
import { UniqueColors } from 'ui/theme/colors'

import { ModalHeader } from './ModalHeader'

interface Props {
  title: string
  visible: boolean
  onCloseIconPress?: () => void
  testIdSuffix?: string
}

export const AppInformationModal: FunctionComponent<Props> = ({
  title,
  visible,
  children,
  onCloseIconPress,
  testIdSuffix,
}) => {
  const { bottom } = useSafeAreaInsets()
  return (
    <React.Fragment>
      <OverlayComponent visible={visible} />
      <Modal
        animationType="slide"
        statusBarTranslucent
        transparent={true}
        visible={visible}
        testID={`modal-${testIdSuffix}`}>
        <ClicAwayArea activeOpacity={1} onPress={onCloseIconPress}>
          <Container activeOpacity={1}>
            <ColoredModalHeader
              title={title}
              rightIcon={Close}
              onRightIconPress={onCloseIconPress}
            />
            <Content style={{ paddingBottom: bottom }}>{children}</Content>
          </Container>
        </ClicAwayArea>
      </Modal>
    </React.Fragment>
  )
}

const ColoredModalHeader = styled(ModalHeader).attrs({
  customStyles: {
    title: {
      fontSize: getSpacing(5),
      fontWeight: 'bold',
      fontStyle: 'normal',
      lineHeight: getSpacing(6),
      color: ColorsEnum.BLACK,
    },
  },
})``

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
  position: 'absolute',
  top: '15%',
  left: '5%',
  flexDirection: 'column',
  backgroundColor: ColorsEnum.WHITE,
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '90%',
  height: '60%',
  borderRadius: getSpacing(4),
  padding: getSpacing(5),
})

const Content = styled.View({
  paddingTop: getSpacing(5),
  width: '100%',
  alignItems: 'center',
  maxWidth: getSpacing(125),
})
