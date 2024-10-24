import React from 'react'

import { render } from 'tests/utils/web'

import { ShareAppModalVersionB } from './ShareAppModalVersionB'

describe('ShareAppModalVersionB', () => {
  it('should render null in web', () => {
    const { container } = render(
      <ShareAppModalVersionB visible close={jest.fn()} share={jest.fn()} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
