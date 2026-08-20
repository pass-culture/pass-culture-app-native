import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
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

export const ModalScreenWrapper = ({
  title,
  onClose,
  children,
  fullScreen,
}: ModalScreenWrapperProps) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isAnimationFinished, setIsAnimationFinished] = useState(false)
  const modalRef = useRef<View>(null)

  const onAnimationFinished = useCallback(() => {
    setIsAnimationFinished(true)
  }, [])

  const enteringAnimation = MODAL_ENTERING.withCallback((finished) => {
    'worklet'
    if (finished) {
      scheduleOnRN(onAnimationFinished)
    }
  })

  useEffect(() => {
    if (isAnimationFinished && modalRef.current) {
      const node = modalRef.current
      node?.focus?.()
    }
  }, [isAnimationFinished])

  useEffect(() => {
    if (!isAnimationFinished) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modalRef.current) return

      const modalElement = modalRef.current as unknown as HTMLElement
      const focusables = modalElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )

      if (focusables.length === 0) {
        event.preventDefault()
        return
      }

      const firstElement = focusables[0]
      const lastElement = focusables[focusables.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === firstElement || document.activeElement === modalElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAnimationFinished])

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
            accessibilityLabel="Fermer la modale en touchant l’arrière-plan"
          />
          <ModalContainer
            ref={modalRef}
            role={AccessibilityRole.DIALOG}
            aria-modal
            aria-labelledby={title}
            tabIndex={-1}
            entering={enteringAnimation}
            exiting={createModalExiting(onClose)}
            fullScreen={fullScreen}>
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
  ...StyleSheet.absoluteFill,
  backgroundColor: OVERLAY_COLOR,
})

const ModalContainer = styled(Animated.View)<{ fullScreen?: boolean }>(({ theme, fullScreen }) => ({
  width: '100%',
  height: fullScreen ? '100%' : 'auto',
  backgroundColor: theme.designSystem.color.background.default,
  borderTopLeftRadius: theme.designSystem.size.borderRadius.l,
  borderTopRightRadius: theme.designSystem.size.borderRadius.l,
  overflow: 'hidden',
  paddingBottom: theme.isMobileViewport ? theme.tabBar.height : undefined,
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
