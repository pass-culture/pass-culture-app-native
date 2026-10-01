import React, { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'

import { IntersectionObserverProps } from './types'

type Percent = `${number}%`

// Area thresholds only decide when the callback runs. A horizontal playlist is
// wider than the screen, so its area ratio stays low even when the row is fully
// in view. Steps every 5% still notify us while it scrolls in.
const VISIBILITY_STEPS = Array.from({ length: 21 }, (_, index) => index / 20)

export function IntersectionObserver({
  children,
  onChange,
  threshold = 0,
}: Readonly<IntersectionObserverProps>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<globalThis.IntersectionObserver | null>(null)

  const handleIntersectionChange = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      if (!entry) return

      const ratio = toVisibilityRatio(threshold)
      const isVisible =
        ratio === 0 ? entry.isIntersecting : getVerticalVisibilityRatio(entry) >= ratio
      onChange(isVisible)
    },
    [onChange, threshold]
  )

  useEffect(() => {
    const target = containerRef.current

    if (!target || typeof window === 'undefined' || !window.IntersectionObserver) {
      onChange(true)
      return
    }

    const ratio = toVisibilityRatio(threshold)
    const observerOptions: IntersectionObserverInit = {
      threshold: ratio === 0 ? 0 : VISIBILITY_STEPS,
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
    <Container ref={containerRef} data-testid="intersectionObserver">
      {children}
    </Container>
  )
}

const Container = styled.div({
  width: '100%',
  // A horizontal playlist's min-content width is the whole row of tiles.
  // As a flex item, that stretches the search header and the visibility box,
  // so the area ratio never reaches the threshold and view-item logs never fire.
  minWidth: 0,
})

function toVisibilityRatio(threshold: Percent | number): number {
  const raw =
    typeof threshold === 'string' && threshold.endsWith('%')
      ? Number.parseFloat(threshold) / 100
      : threshold > 1
        ? threshold / 100
        : threshold

  if (Number.isNaN(raw)) return 1
  return Math.min(1, Math.max(0, raw))
}

function getVerticalVisibilityRatio(entry: IntersectionObserverEntry): number {
  const height = entry.boundingClientRect?.height ?? 0
  if (height <= 0) return 0
  return entry.intersectionRect.height / height
}
