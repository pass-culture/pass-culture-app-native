import React, { useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Easing, FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import styled from 'styled-components/native'

import Animated from 'libs/react-native-reanimated'
import { useEscapeKeyAction } from 'ui/hooks/useEscapeKeyAction'

import { ModalScreenWrapperProps } from './ModalScreenWrapper'

const TRANSITION_DURATION = 100
const DESKTOP_MAX_HEIGHT_RATIO = 0.75
const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.7)'

const BACKDROP_ENTERING = FadeIn.duration(TRANSITION_DURATION)
const BACKDROP_EXITING = FadeOut.duration(TRANSITION_DURATION)
const MODAL_ENTERING = SlideInDown.duration(TRANSITION_DURATION).easing(Easing.out(Easing.ease))
const MODAL_EXITING = SlideOutDown.duration(TRANSITION_DURATION).easing(Easing.in(Easing.ease))

const createModalExiting = (onClose: () => void) =>
  MODAL_EXITING.withCallback((finished) => {
    'worklet'
    if (finished) {
      scheduleOnRN(onClose)
    }
  })

export const ModalScreenWrapper = ({ onClose, children }: ModalScreenWrapperProps) => {
  const [isOpen, setIsOpen] = useState(true)

  const closeWithTransition = () => {
    setIsOpen((open) => (open ? false : open))
  }

  useEscapeKeyAction(closeWithTransition)

  return (
    <Root>
      {isOpen ? (
        <React.Fragment>
          <Backdrop
            entering={BACKDROP_ENTERING}
            exiting={BACKDROP_EXITING}
            onPress={closeWithTransition}
            accessibilityLabel="Fermer la modale"
          />
          <ModalContainer entering={MODAL_ENTERING} exiting={createModalExiting(onClose)}>
            {children(closeWithTransition)}
          </ModalContainer>
        </React.Fragment>
      ) : null}
    </Root>
  )
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const Root = styled.View(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: theme.zIndex.bottomSheet,
  alignItems: 'center',
  justifyContent: theme.isDesktopViewport ? 'center' : 'flex-end',
}))

const Backdrop = styled(AnimatedPressable)({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: OVERLAY_COLOR,
})

const ModalContainer = styled(Animated.View)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: theme.designSystem.color.background.default,
  borderTopLeftRadius: theme.designSystem.size.borderRadius.l,
  borderTopRightRadius: theme.designSystem.size.borderRadius.l,
  overflow: 'hidden',
  ...(theme.isDesktopViewport
    ? {
        borderBottomLeftRadius: theme.designSystem.size.borderRadius.l,
        borderBottomRightRadius: theme.designSystem.size.borderRadius.l,
        maxWidth: theme.modal.desktopMaxWidth,
        maxHeight: `${DESKTOP_MAX_HEIGHT_RATIO * 100}%`,
      }
    : {
        maxWidth: theme.appContentWidth,
      }),
}))
