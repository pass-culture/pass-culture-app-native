import React, { FC, useEffect, useRef } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { IntersectionObserverProps } from './types'

const isEntryVisible = (entry: IntersectionObserverEntry, threshold?: number) => {
  const boundsHeight = entry.boundingClientRect.height
  if (threshold === undefined || !boundsHeight) return !!entry.isIntersecting

  const visibleRatio = entry.intersectionRect.height / boundsHeight
  return !!entry.isIntersecting && visibleRatio >= threshold
}

export const IntersectionObserver: FC<IntersectionObserverProps> = ({
  children,
  onChange,
  threshold,
  fill = false,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const targetRef = useRef<View | null>(null)

  useEffect(
    function loadIntersectionObserver() {
      const IntersectionObserverAPI = globalThis.IntersectionObserver
      if (typeof IntersectionObserverAPI !== 'function') {
        if (Platform.OS === 'web') onChange(true)
        return
      }

      const target = targetRef.current
      if (!target) return

      const element = target as unknown as Element
      observerRef.current = new IntersectionObserverAPI(
        (entries) => {
          const entry = entries[0]
          if (!entry) return
          onChange(isEntryVisible(entry, threshold))
        },
        { threshold }
      )
      observerRef.current.observe(element)

      return () => {
        observerRef.current?.unobserve(element)
        observerRef.current?.disconnect()
        observerRef.current = null
      }
    },
    [onChange, threshold]
  )

  return (
    <Container ref={targetRef} fill={fill} testID="intersectionObserver">
      {children}
    </Container>
  )
}

const Container = styled(View)<{ fill: boolean }>(({ fill }) => ({
  ...(fill ? { flex: 1 } : null),
}))
