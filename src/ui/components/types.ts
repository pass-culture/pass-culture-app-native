import { StepVariant } from 'ui/components/VerticalStepper/types'

export type MarkdownPartProps = {
  text: string
  isBold?: boolean
  isItalic?: boolean
}

export type FirstOrLastProps = {
  isFirst?: boolean
  isLast?: boolean
}

export type StepVariantProps = {
  /**
   * Use this prop to handle correct stepper step.
   *
   * There is 3 variants available:
   * - `VerticalStepperVariant.complete` for completed step
   * - `VerticalStepperVariant.in_progress` for in-progress step
   * - `VerticalStepperVariant.future` for future step
   *
   * Each one has its own styling, and it should always be only one "in-progress" step.
   * It may exist 0 or more completed and future steps.
   */
  variant: StepVariant
}

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
   * Specifies if it should end with a dot.
   *
   * - When you only have one dotted line it should be set to `true`.
   * - When you have multiple dotted lines following each other, it should be set to `false` so
   * it seems linear.
   */
  endsWithDot?: boolean
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
