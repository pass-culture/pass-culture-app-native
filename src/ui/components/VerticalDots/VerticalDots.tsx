import React from 'react'
import styled from 'styled-components/native'

// Disable ESLint because I need this colors enum.
// eslint-disable-next-line no-restricted-imports

import { DotSize, VerticalDotsProps } from 'ui/components/types'

/**
 * A dot size can either be a number so the dot will be rounded,
 * or an object with width and height that allows you to get
 * nice shapes.
 */

type GetDotCountOptions = {
  availableHeight: number
  dotHeight: number
  minimumDotSpacing: number
  endsWithDot?: boolean
}
/**
 * This is a utility to compute dot count based on how big the parent is and the dot size.
 */
const getDotCount = ({
  availableHeight,
  dotHeight,
  endsWithDot,
  minimumDotSpacing,
}: GetDotCountOptions) => {
  const dotPlusSpacing = dotHeight + minimumDotSpacing
  return Math.floor((availableHeight + (endsWithDot ? minimumDotSpacing : 0)) / dotPlusSpacing)
}

/**
 * Utility to get dot height
 */
function getDotHeight(dotSize: DotSize) {
  if (typeof dotSize === 'number') return dotSize
  return dotSize.height
}

/**
 * Utility to get dot width
 */
function getDotWidth(dotSize: DotSize) {
  if (typeof dotSize === 'number') return dotSize
  return dotSize.width
}

/**
 * A component that draws a vertical line of dots.
 *
 * Spacing, dot size (first, last and others), dot color are customizable.
 * You can also customize first and last dot sizes independently.
 */
export function VerticalDots({
  parentHeight,
  parentWidth,
  dotSize = parentWidth,
  endsWithDot,
  testID,
  firstDotSize = dotSize,
  lastDotSize = dotSize,
}: VerticalDotsProps) {
  const minimumDotSpacing = getDotWidth(dotSize)

  const dotCount = getDotCount({
    dotHeight: getDotHeight(dotSize),
    minimumDotSpacing,
    endsWithDot,
    availableHeight: parentHeight,
  })

  return (
    <Wrapper testID={testID}>
      {Array.from({ length: dotCount }).map((_, index) => {
        const key = `dot-${index}`
        const isFirst = index === 0
        const isLast = index === dotCount - 1

        const defaultOrLastSize = isLast ? lastDotSize : dotSize
        const size = isFirst ? firstDotSize : defaultOrLastSize

        return (
          <Dot
            key={key}
            dotSize={size}
            spacing={minimumDotSpacing}
            endsWithDot={endsWithDot}
            isLast={isLast}
          />
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.View({
  justifyContent: 'space-between',
  flexGrow: 1,
})

type DotProps = {
  dotSize: DotSize
  spacing: number
  endsWithDot?: boolean
  isLast: boolean
}

const Dot = styled.View<DotProps>(({ dotSize, theme, spacing, endsWithDot, isLast }) => ({
  width: getDotWidth(dotSize),
  height: getDotHeight(dotSize),
  borderRadius: Math.max(getDotWidth(dotSize), getDotHeight(dotSize)) / 2,
  backgroundColor: theme.designSystem.separator.color.default,
  marginBottom: isLast && !endsWithDot ? spacing : 0,
}))
