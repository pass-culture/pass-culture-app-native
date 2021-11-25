import { createElement, Fragment, ReactNode } from 'react'

// eslint-disable-next-line react/display-name
export default ({ children }: { children: ReactNode }) => createElement(Fragment, {}, children)
