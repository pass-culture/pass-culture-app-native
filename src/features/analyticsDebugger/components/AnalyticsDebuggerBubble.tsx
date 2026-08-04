import React, { useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { analyticsDebuggerActions } from 'features/analyticsDebugger/store/analyticsDebuggerStore'
import { Typo } from 'ui/theme'

const INITIAL_POSITION = { x: 16, y: 160 }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const AnalyticsDebuggerBubble = () => {
  const { width, height } = useWindowDimensions()
  const bubbleSize = useTheme().designSystem.size.spacing.xxxxl
  const [position, setPosition] = useState(INITIAL_POSITION)

  const gesture = useMemo(() => {
    const drag = Gesture.Pan()
      .runOnJS(true)
      .onChange((event) => {
        setPosition({
          x: clamp(event.absoluteX - bubbleSize / 2, 0, width - bubbleSize),
          y: clamp(event.absoluteY - bubbleSize / 2, 0, height - bubbleSize),
        })
      })
    const tap = Gesture.Tap()
      .runOnJS(true)
      .withTestId('analyticsDebuggerBubbleTap')
      .onStart(() => analyticsDebuggerActions.toggleOverlay())
    const hideOnLongPress = Gesture.LongPress()
      .minDuration(600)
      .runOnJS(true)
      .withTestId('analyticsDebuggerBubbleLongPress')
      .onStart(() => analyticsDebuggerActions.setBubbleVisible(false))
    return Gesture.Race(drag, hideOnLongPress, tap)
  }, [width, height, bubbleSize])

  return (
    <GestureDetector gesture={gesture}>
      <Bubble
        style={{ left: position.x, top: position.y }}
        collapsable={false}
        accessibilityLabel="Ouvrir l’analytics debugger"
        testID="analyticsDebuggerBubble">
        <Typo.BodyAccent>📈</Typo.BodyAccent>
      </Bubble>
    </GestureDetector>
  )
}

const Bubble = styled.View(({ theme }) => ({
  position: 'absolute',
  width: theme.designSystem.size.spacing.xxxxl,
  height: theme.designSystem.size.spacing.xxxxl,
  borderRadius: theme.designSystem.size.borderRadius.pill,
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  opacity: 0.85,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  elevation: 10,
}))
