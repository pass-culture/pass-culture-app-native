import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInRight,
  SlideOutDown,
  SlideOutRight,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useEscapeKeyAction } from 'ui/hooks/useEscapeKeyAction'
import { useModalFocusTrap } from 'ui/hooks/useModalFocusTrap'

import { ModalScreenWrapperProps } from './ModalScreenWrapper'

const TRANSITION_DURATION = 100
const DESKTOP_MAX_HEIGHT_RATIO = 0.75

const BACKDROP_ENTERING = FadeIn.duration(TRANSITION_DURATION)
const BACKDROP_EXITING = FadeOut.duration(TRANSITION_DURATION)
const createModalEntering = (transition: 'bottom' | 'right') =>
  (transition === 'right' ? SlideInRight : SlideInDown)
    .duration(TRANSITION_DURATION)
    .easing(Easing.out(Easing.ease))

const createModalExiting = (transition: 'bottom' | 'right', onClose: () => void) =>
  (transition === 'right' ? SlideOutRight : SlideOutDown)
    .duration(TRANSITION_DURATION)
    .easing(Easing.in(Easing.ease))
    .withCallback((finished) => {
      'worklet'
      if (finished) {
        scheduleOnRN(onClose)
      }
    })

export const ModalScreenWrapper = ({
  title,
  onClose,
  children,
  fullScreen,
  desktopMaxWidth,
  desktopMaxHeight,
  desktopVariant = 'centered',
  initialFocusSelector,
}: ModalScreenWrapperProps) => {
  const { isDesktopViewport } = useTheme()
  const titleId = uuidv4()
  const [isOpen, setIsOpen] = useState(true)
  const [isAnimationFinished, setIsAnimationFinished] = useState(false)
  const modalRef = useRef<View>(null)

  const onAnimationFinished = useCallback(() => {
    setIsAnimationFinished(true)
  }, [])

  const transition = isDesktopViewport && desktopVariant === 'bottomRight' ? 'right' : 'bottom'
  const enteringAnimation = useMemo(
    () =>
      createModalEntering(transition).withCallback((finished) => {
        'worklet'
        if (finished) {
          scheduleOnRN(onAnimationFinished)
        }
      }),
    [onAnimationFinished, transition]
  )

  useModalFocusTrap(modalRef, isAnimationFinished, initialFocusSelector)

  const closeWithTransition = () => {
    setIsOpen((open) => (open ? false : open))
  }

  useEscapeKeyAction(closeWithTransition)

  return (
    <Root desktopVariant={desktopVariant}>
      {isOpen ? (
        <React.Fragment>
          <Backdrop
            entering={BACKDROP_ENTERING}
            exiting={BACKDROP_EXITING}
            onPress={closeWithTransition}
            accessibilityLabel="Fermer la modale en touchant l’arrière-plan"
            accessibilityRole={AccessibilityRole.BUTTON}
          />
          <ModalContainer
            ref={modalRef}
            role={AccessibilityRole.DIALOG}
            aria-modal
            aria-label={title}
            aria-labelledby={titleId}
            tabIndex={-1}
            entering={enteringAnimation}
            exiting={createModalExiting(transition, onClose)}
            fullScreen={fullScreen}
            desktopMaxWidth={desktopMaxWidth}
            desktopMaxHeight={desktopMaxHeight}
            desktopVariant={desktopVariant}>
            {children(closeWithTransition, titleId)}
          </ModalContainer>
        </React.Fragment>
      ) : null}
    </Root>
  )
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const Root = styled.View<{ desktopVariant: 'centered' | 'bottomRight' }>(
  ({ theme, desktopVariant }) => ({
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: theme.zIndex.bottomSheet,
    alignItems: theme.isDesktopViewport && desktopVariant === 'bottomRight' ? 'flex-end' : 'center',
    justifyContent:
      theme.isDesktopViewport && desktopVariant === 'centered' ? 'center' : 'flex-end',
  })
)

const Backdrop = styled(AnimatedPressable)(({ theme }) => ({
  ...StyleSheet.absoluteFill,
  backgroundColor: theme.designSystem.color.background.overlay,
}))

const ModalContainer = styled(Animated.View)<{
  fullScreen?: boolean
  desktopMaxWidth?: number
  desktopMaxHeight?: number | string
  desktopVariant: 'centered' | 'bottomRight'
}>(({ theme, fullScreen, desktopMaxWidth, desktopMaxHeight, desktopVariant }) => ({
  width: '100%',
  height: fullScreen ? '100%' : 'auto',
  maxHeight: '100%',
  backgroundColor: theme.designSystem.color.background.default,
  borderTopLeftRadius: theme.designSystem.size.borderRadius.l,
  borderTopRightRadius: theme.designSystem.size.borderRadius.l,
  overflow: 'hidden',
  paddingBottom: theme.isMobileViewport ? theme.tabBar.height : undefined,
  ...(theme.isDesktopViewport
    ? {
        borderBottomLeftRadius:
          desktopVariant === 'centered' ? theme.designSystem.size.borderRadius.l : undefined,
        borderBottomRightRadius:
          desktopVariant === 'centered' ? theme.designSystem.size.borderRadius.l : undefined,
        maxWidth: desktopMaxWidth ?? theme.modal.desktopMaxWidth,
        maxHeight: desktopMaxHeight ?? `${DESKTOP_MAX_HEIGHT_RATIO * 100}%`,
      }
    : {
        maxWidth: theme.appContentWidth,
      }),
}))
