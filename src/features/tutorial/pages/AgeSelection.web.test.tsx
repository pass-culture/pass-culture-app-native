import React from 'react'

import { render } from 'tests/utils/web'

import { AgeSelection } from './AgeSelection'

describe('AgeSelection', () => {
  it('should render null in web', () => {
    const { container } = render(<AgeSelection />)
    expect(container).toBeEmptyDOMElement()
  })
})
