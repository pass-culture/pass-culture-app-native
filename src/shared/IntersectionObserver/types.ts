import { ReactNode } from 'react'
export interface IntersectionObserverProps {
  children: ReactNode
  onChange: (inView: boolean) => void
  threshold?: number
  id?: string
  // Keeps the observed box to the parent viewport. A vertical list needs this,
  // otherwise it grows with its content and every item counts as visible.
  fill?: boolean
}
