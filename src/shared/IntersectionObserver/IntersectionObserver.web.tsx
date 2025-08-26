import React, { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'

import { logPlaylistDebug } from 'shared/analytics/logViewItem'

import { parseThreshold } from './helpers'
import { IntersectionObserverProps } from './types'

const DEFAULT_CONTAINER_HEIGHT_FOR_PERCENTAGE_CALCULATION = 100

export function IntersectionObserver({
  children,
  onChange,
  threshold = 0,
}: Readonly<IntersectionObserverProps>) {
  const targetRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<globalThis.IntersectionObserver | null>(null)

  const handleIntersectionChange = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      if (entry) {
        logPlaylistDebug('INTERSECTION_OBSERVER_WEB', 'IntersectionObserver state changed', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          threshold,
        })
        onChange(entry.isIntersecting)
      }
    },
    [onChange, threshold]
  )

  useEffect(() => {
    const target = targetRef.current

    if (!target || typeof window === 'undefined' || !window.IntersectionObserver) {
      onChange(true)
      return
    }

    const parentElement = target.parentElement
    const elementHeight =
      parentElement?.offsetHeight || DEFAULT_CONTAINER_HEIGHT_FOR_PERCENTAGE_CALCULATION
    const thresholdConfig = parseThreshold(threshold, elementHeight)

    target.style.top = `${thresholdConfig.value}px`

    const observerOptions: IntersectionObserverInit = {
      threshold: 0,
    }

    observerRef.current = new globalThis.IntersectionObserver(
      handleIntersectionChange,
      observerOptions
    )
    observerRef.current.observe(target)

    return () => {
      if (observerRef.current && target) {
        observerRef.current.unobserve(target)
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [threshold, handleIntersectionChange, onChange])

  return (
    <Container>
      <ObserverTarget ref={targetRef} data-testid="intersectionObserver" />
      {children}
    </Container>
  )
}

const Container = styled.div({
  position: 'relative',
})

const ObserverTarget = styled.div<{ 'data-testid'?: string }>(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '1px',
  height: '1px',
  pointerEvents: 'none',
  visibility: 'hidden',
}))
