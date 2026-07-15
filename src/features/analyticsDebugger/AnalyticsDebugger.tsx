import React, { PropsWithChildren, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

import { AnalyticsDebuggerBubble } from 'features/analyticsDebugger/components/AnalyticsDebuggerBubble'
import { AnalyticsDebuggerModal } from 'features/analyticsDebugger/components/AnalyticsDebuggerModal'
import {
  analyticsDebuggerActions,
  useAnalyticsDebuggerBubbleVisible,
} from 'features/analyticsDebugger/store/analyticsDebuggerStore'
import { env } from 'libs/environment/env'

const AnalyticsDebuggerContent = ({ children }: PropsWithChildren) => {
  const bubbleVisible = useAnalyticsDebuggerBubbleVisible()

  // A two-finger long press is much more reliable than a two-finger double tap: there is no
  // timing window and stationary fingers do not compete with scroll gestures.
  const twoFingerLongPress = useMemo(
    () =>
      Gesture.LongPress()
        .numberOfPointers(2)
        .minDuration(800)
        .maxDistance(50)
        .runOnJS(true)
        .withTestId('analyticsDebuggerGesture')
        .onStart(() => analyticsDebuggerActions.toggleBubble()),
    []
  )

  return (
    <React.Fragment>
      <GestureDetector gesture={twoFingerLongPress}>
        {/* collapsable={false} so the gesture handler can attach to a real native view on Android */}
        <View style={styles.container} collapsable={false}>
          {children}
          {bubbleVisible ? <AnalyticsDebuggerBubble /> : null}
        </View>
      </GestureDetector>
      <AnalyticsDebuggerModal />
    </React.Fragment>
  )
}

export const AnalyticsDebugger = ({ children }: PropsWithChildren) => {
  if (!env.ANALYTICS_DEBUGGER_ENABLED) return <React.Fragment>{children}</React.Fragment>
  return <AnalyticsDebuggerContent>{children}</AnalyticsDebuggerContent>
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})
