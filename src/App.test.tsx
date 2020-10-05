import React from 'react'
import TestRenderer from 'react-test-renderer'

import { tick } from 'libs/utils.test'

import { App } from './App'

describe('App', () => {
  it('instantiate the application', async () => {
    TestRenderer.create(<App />)
    await TestRenderer.act(async () => {
      await tick()
    })
  })
})
