import { createElement, Fragment, ReactNode } from 'react'


export default ({ children }: { children: ReactNode }) => createElement(Fragment, { children })
