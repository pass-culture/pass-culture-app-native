export enum StepVariant {
  complete = 'complete',
  in_progress = 'in_progress',
  future = 'future',
}

/**
 * Give these props when you know the item is the first one.
 */
export type FirstVerticalStepperProps = {
  isFirst: true
  isLast?: false
}

/**
 * Give these props when you know the item is the last one.
 */
export type LastVerticalStepperProps = {
  isFirst?: false
  isLast: true
}

/**
 * Give these props when the item is neither the first one nor the last one.
 */
export type NeitherFirstOrLastVerticalStepperProps = {
  isFirst?: false
  isLast?: false
}
