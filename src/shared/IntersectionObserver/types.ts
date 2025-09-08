import { ReactNode } from 'react'

type Percent = `${number}%`

export interface IntersectionObserverProps {
  children: ReactNode
  onChange: (inView: boolean) => void
  threshold?: Percent | number
  id?: string
}
