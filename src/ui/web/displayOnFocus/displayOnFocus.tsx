import { ComponentType } from 'react'

export const displayOnFocus = <Props,>(Component: ComponentType<Props>): ComponentType<Props> =>
  Component
