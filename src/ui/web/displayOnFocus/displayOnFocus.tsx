import { ComponentType } from 'react'

const NeverRender = () => null

export const displayOnFocus = <Props,>(_Component: ComponentType<Props>) => NeverRender
