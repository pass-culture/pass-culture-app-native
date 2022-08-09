import { ComponentType, FunctionComponent } from 'react'

const NeverRender: FunctionComponent = () => null

export const displayOnFocus = <Props,>(_Component: ComponentType<Props>): ComponentType<Props> =>
  NeverRender
