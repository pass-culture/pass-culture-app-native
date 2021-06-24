import React from 'react'

import { render } from 'tests/utils'

import { Style } from '../Style'

describe('Style', () => {
  it('should render null on native', () => {
    const css = `body { color: red; }`
    const renderAPI = render(<Style>{css}</Style>)
    expect(renderAPI.toJSON()).toBe(null)
  })
})
