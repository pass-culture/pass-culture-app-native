import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { ImageTile } from 'ui/components/ImageTile'

const props = {
  height: 100,
  width: 100,
  uri: 'uri_thumb_url',
}

describe('<ImageTile/>', () => {
  it('should render image when uri defined', () => {
    render(reactQueryProviderHOC(<ImageTile {...props} onlyTopBorderRadius />))

    expect(screen.getByTestId('tileImage')).toBeOnTheScreen()
  })

  it('should render image placeholder when uri not defined', () => {
    render(reactQueryProviderHOC(<ImageTile {...props} onlyTopBorderRadius uri={undefined} />))

    expect(screen.getByTestId('imagePlaceholder')).toBeOnTheScreen()
  })
})
