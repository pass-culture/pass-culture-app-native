import React from 'react'

import { render } from 'tests/utils/web'

import { ShareAppModalVersionA } from './ShareAppModalVersionA'

describe('ShareAppModalVersionA', () => {
  it('should render null in web', () => {
    const { container } = render(
      <ShareAppModalVersionA visible close={jest.fn()} share={jest.fn()} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
