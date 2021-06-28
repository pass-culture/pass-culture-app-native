import React from 'react'

import { render } from 'tests/utils'

import { Style } from '../Style'

describe('Style', () => {
  it('should render a style tag including theCSS on the Web', () => {
    const css = `body { color: red; }`
    const renderAPI = render(<Style>{css}</Style>)
    expect(renderAPI.toJSON()).toEqual(render(<style type="text/css">{css}</style>).toJSON())
  })
})
