import React from 'react'

import { render } from 'tests/utils/web'
import { ImageTile } from 'ui/components/ImageTile'

const props = {
  height: 100,
  width: 100,
  uri: 'uri_thumb_url',
}

describe('<ImageTile/>', () => {
  it('should render correctly', () => {
    const { container } = render(<ImageTile {...props} onlyTopBorderRadius />)

    expect(container).toMatchSnapshot()
  })
})
