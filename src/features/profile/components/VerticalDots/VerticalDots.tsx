import React from 'react'
import styled from 'styled-components/native'

// Disable ESLint because I need this colors enum.
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { AutomaticVerticalDots } from './AutomaticVerticalDots'

/**
 * A dot size can either be a number so the dot will be rounded,
 * or an object with width and height that allows you to get
 * nice shapes.
 */
export type DotSize = number | { width: number; height: number }

export interface VerticalDotsProps {
  /**
   * Only used to compute dot size when `dotSize` is not passed.
   */
  parentWidth: number
  /**
   * This is the **VerticalDots** parent height.
   *
   * Used to compute dot count.
   */
  parentHeight: number
  /**
   * Manually set dot size.
   *
   * If not given, it will automatically set dot size based on parentWidth value.
   *
   * @default parentWidth
   */
  dotSize?: DotSize
  /**
   * Space between each dot.
   * Note that it won't be respected exactly since dot count is dynamic and that will avoid
   * getting weird space at the end
   *
   * @default dotSize
   */
  minimumDotSpacing?: number
  /**
   * Specifies if it should end with a dot.
   *
   * - When you only have one dotted line it should be set to `true`.
   * - When you have multiple dotted lines following each other, it should be set to `false` so
   * it seems linear.
   */
  endsWithDot?: boolean
  /**
   * Custom dot color.
   *
   * @default theme.colors.greyMedium
   */
  dotColor?: ColorsEnum
  /**
   * If you want a custom size for the first dot.
   *
   * @default dotSize
   */
  firstDotSize?: DotSize
  /**
   * If you want a custom size for the last dot.
   *
   * @default dotSize
   */
  lastDotSize?: DotSize
  testID?: string
}

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
  minimumDotSpacing = getDotHeight(dotSize),
  endsWithDot,
  dotColor,
  testID,
  firstDotSize = dotSize,
  lastDotSize = dotSize,
}: VerticalDotsProps) {
  const dotCount = getDotCount({
    dotHeight: getDotHeight(dotSize),
    minimumDotSpacing,
    endsWithDot,
    availableHeight: parentHeight,
  })

  return (
    <Wrapper testID={testID}>
      {Array.from({ length: dotCount }).map((_, index) => {
        const isFirst = index === 0
        const isLast = index === dotCount - 1

        const size = isFirst ? firstDotSize : isLast ? lastDotSize : dotSize

        return (
          <Dot
            key={index}
            dotSize={size}
            spacing={minimumDotSpacing}
            color={dotColor}
            endsWithDot={endsWithDot}
            isLast={isLast}
          />
        )
      })}
    </Wrapper>
  )
}

VerticalDots.Auto = AutomaticVerticalDots

const Wrapper = styled.View({
  justifyContent: 'space-between',
  flexGrow: 1,
})

type DotProps = {
  dotSize: DotSize
  spacing: number
  color?: ColorsEnum
  endsWithDot?: boolean
  isLast: boolean
}

const Dot = styled.View<DotProps>(
  ({ dotSize, theme, spacing, color = theme.colors.greyMedium, endsWithDot, isLast }) => ({
    width: getDotWidth(dotSize),
    height: getDotHeight(dotSize),
    borderRadius: Math.max(getDotWidth(dotSize), getDotHeight(dotSize)) / 2,
    backgroundColor: color,
    marginBottom: isLast && !endsWithDot ? spacing : 0,
  })
)
