import React from 'react'

import { render } from 'tests/utils'
import { ImageTile } from 'ui/components/ImageTile'

jest.mock('features/auth/settings')

const props = {
  height: 100,
  width: 100,
  uri: 'uri_thumb_url',
}

describe('<ImageTile/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ImageTile {...props} onlyTopBorderRadius />)
    expect(renderAPI).toMatchSnapshot()
  })
})
