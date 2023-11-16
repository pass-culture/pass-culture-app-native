import React, { useCallback, useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle, View } from 'react-native'
import styled from 'styled-components/native'

import type { VerticalDotsProps } from './VerticalDots'
import { VerticalDots } from './VerticalDots'

type AutomaticVerticalDotsProps = Omit<VerticalDotsProps, 'parentHeight' | 'parentWidth'>
type Dimensions = Omit<LayoutRectangle, 'x' | 'y'>

/**
 * This component is just a full flex wrapper that gives props to `VerticalDotProps`
 */
export function AutomaticVerticalDots(props: Readonly<AutomaticVerticalDotsProps>) {
  const [{ width, height }, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  })

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setDimensions(event.nativeEvent.layout)
  }, [])

  return (
    <Wrapper onLayout={onLayout}>
      <VerticalDots parentWidth={width} parentHeight={height} {...props} />
    </Wrapper>
  )
}

const Wrapper = styled(View)({
  flex: 1,
  height: 0,
})
