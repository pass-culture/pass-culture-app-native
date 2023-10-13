import React from 'react'

import { render, screen } from 'tests/utils'
import { ImageTile } from 'ui/components/ImageTile'

const props = {
  height: 100,
  width: 100,
  uri: 'uri_thumb_url',
}

describe('<ImageTile/>', () => {
  it('should render correctly', () => {
    render(<ImageTile {...props} onlyTopBorderRadius />)
    expect(screen).toMatchSnapshot()
  })
})
