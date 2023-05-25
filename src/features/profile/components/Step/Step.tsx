import { ReactNode } from 'react'

export interface StepProps {
  /**
   * This content will be shown on the right side of this component.
   */
  children: ReactNode
}

/**
 * This component is a placeholder that user will give to `StepList`.
 * It renders nothing since **InternalStep** will be used by **StepList**
 * to render to the DOM.
 */
export function Step(_props: StepProps) {
  return null
}
