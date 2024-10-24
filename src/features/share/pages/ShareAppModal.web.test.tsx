import React from 'react'

import { render } from 'tests/utils/web'

import { ShareAppModal } from './ShareAppModal'

describe('ShareAppModal', () => {
  it('should render null in web', () => {
    const { container } = render(<ShareAppModal visible close={jest.fn()} share={jest.fn()} />)

    expect(container).toBeEmptyDOMElement()
  })
})
