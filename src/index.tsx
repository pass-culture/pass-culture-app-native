import 'react-app-polyfill/stable'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'

const t0 = performance.now()
console.log(`Start of App ${t0}`)
const container = document.getElementById('root')
// Argument of type 'HTMLElement | null' is not assignable to parameter of type 'Element | DocumentFragment'.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(<App tab="home" />)
