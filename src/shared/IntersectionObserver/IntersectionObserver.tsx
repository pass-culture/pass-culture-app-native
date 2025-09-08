import React, { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { InView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { logPlaylistDebug } from 'shared/analytics/logViewItem'

import { parseThreshold } from './helpers'
import { IntersectionObserverProps } from './types'

export function IntersectionObserver({
  children,
  onChange,
  threshold = 0,
}: Readonly<IntersectionObserverProps>) {
  const [containerHeight, setContainerHeight] = useState<number>(0)

  const handleChange = (inView: boolean) => {
    logPlaylistDebug('INTERSECTION_OBSERVER_NATIVE', 'IntersectionObserver state changed', {
      inView,
      threshold,
    })
    onChange(inView)
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setContainerHeight(height)
  }

  const thresholdConfig = parseThreshold(threshold, containerHeight)

  return (
    <Container onLayout={handleLayout}>
      <StyledInView
        testID="intersectionObserver"
        onChange={handleChange}
        threshold={thresholdConfig.value}>
        {null}
      </StyledInView>
      {children}
    </Container>
  )
}

const Container = styled.View({
  position: 'relative',
})

const StyledInView = styled(InView).attrs<{ testID?: string }>({})<{
  threshold: number
}>(({ threshold }) => ({
  position: 'absolute',
  bottom: 0,
  top: threshold,
  left: 0,
  right: 0,
}))
