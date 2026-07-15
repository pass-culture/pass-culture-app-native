import React, { useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { analyticsDebuggerActions } from 'features/analyticsDebugger/store/analyticsDebuggerStore'
import { Typo } from 'ui/theme'

const BUBBLE_SIZE = 48
const INITIAL_POSITION = { x: 16, y: 160 }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const AnalyticsDebuggerBubble = () => {
  const { width, height } = useWindowDimensions()
  const [position, setPosition] = useState(INITIAL_POSITION)

  const gesture = useMemo(() => {
    const drag = Gesture.Pan()
      .runOnJS(true)
      .onChange((event) => {
        setPosition({
          x: clamp(event.absoluteX - BUBBLE_SIZE / 2, 0, width - BUBBLE_SIZE),
          y: clamp(event.absoluteY - BUBBLE_SIZE / 2, 0, height - BUBBLE_SIZE),
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
  }, [width, height])

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
  width: BUBBLE_SIZE,
  height: BUBBLE_SIZE,
  borderRadius: BUBBLE_SIZE / 2,
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  opacity: 0.85,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  elevation: 10,
}))
