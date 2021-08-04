import React from 'react'

import { render } from 'tests/utils/web'
import { ImageTile } from 'ui/components/ImageTile'
import { LENGTH_L, RATIO_HOME_IMAGE } from 'ui/theme'

const imageHeight = LENGTH_L
const imageWidth = imageHeight * RATIO_HOME_IMAGE
const uri = 'uri_thumb_url'

describe('<ImageTile/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <ImageTile imageWidth={imageWidth} imageHeight={imageHeight} uri={uri} onlyTopBorderRadius />
    )
    expect(renderAPI).toMatchSnapshot()
  })
})
