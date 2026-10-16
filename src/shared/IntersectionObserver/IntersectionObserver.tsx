import React, { FC, useEffect, useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { IntersectionObserverProps } from './types'

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
      setTimeout(() => {
        observerRef.current = new globalThis.IntersectionObserver(
          (entries) => {
            onChange(!!entries[0]?.isIntersecting)
          },
          {
            threshold,
          }
        )
        if (targetRef.current) {
          observerRef.current.observe(targetRef.current as unknown as Element)
        }
        return () => {
          observerRef.current?.disconnect()
        }
      }, 300)
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
