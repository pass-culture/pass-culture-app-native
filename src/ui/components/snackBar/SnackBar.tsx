import React, {
  useState,
  useRef,
  useEffect,
  RefObject,
  useCallback,
  FunctionComponent,
} from 'react'
import { StatusBar, ViewProps, ViewStyle } from 'react-native'
import { AnimatableProperties, View as AnimatableView } from 'react-native-animatable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { Close } from 'ui/svg/icons/Close'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing } from 'ui/theme'
import { ZIndexes } from 'ui/theme/layers'

type RefType = RefObject<
  React.Component<AnimatableProperties<ViewStyle> & ViewProps, never, never> & {
    fadeOutUp: (duration: number) => void
    fadeInDown: (duration: number) => void
  }
> | null

export type PropsType = {
  visible: boolean
  message: string
  icon: FunctionComponent<IconInterface>
  onClose: () => void
  timeout: number
  backgroundColor: ColorsEnum
  color: ColorsEnum
  animationDuration: number
}

export const SnackBar = (props: PropsType) => {
  const Icon = props.icon
  const containerRef: RefType = useRef(null)

  const triggerVanishAnimation = useCallback(
    async () => containerRef?.current?.fadeOutUp(props.animationDuration),
    []
  )
  const triggerApparitionAnimation = useCallback(
    async () => containerRef?.current?.fadeInDown(props.animationDuration),
    []
  )

  useEffect(() => {
    if (props.visible) {
      triggerApparitionAnimation()
    }
    if (!props.visible) {
      triggerVanishAnimation()
    }
  }, [props.visible])

  useEffect(() => void setTimeout(props.onClose, props.timeout), [props.onClose, props.timeout])

  const { top } = useSafeAreaInsets()

  return (
    <AnimatedContainer
      backgroundColor={props.backgroundColor}
      marginTop={top}
      easing="ease"
      duration={props.animationDuration}
      ref={containerRef}>
      <StatusBar hidden />
      <SnackBarContainer>
        <ContentContainer testID="toasterContainer">
          <Icon size={20} color={props.color} />
          <Text color={props.color}>{props.message}</Text>
        </ContentContainer>
        <CloseIconContainer onPress={props.onClose}>
          <Close size={24} color={props.color} />
        </CloseIconContainer>
      </SnackBarContainer>
    </AnimatedContainer>
  )
}
const AnimatedContainer = styled(AnimatableView)<{ backgroundColor: string; marginTop: number }>(
  ({ marginTop = 0 }) => ({
    position: 'absolute',
    top: marginTop,
    left: 0,
    right: 0,
    zIndex: ZIndexes.SNACK_BAR,
  })
)

const SnackBarContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const ContentContainer = styled.View({
  flexGrow: 1,
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(2),
  marginLeft: getSpacing(1),
})

const Text = styled.Text<{ color: string }>(({ color }) => ({
  color,
  marginLeft: getSpacing(1),
}))

const CloseIconContainer = styled.TouchableOpacity({
  paddingHorizontal: 10,
})
