import React from 'react'

import { render } from 'tests/utils/web'

import { ClippedImage } from './ClippedImage'

const props = {
  clipId: 'clipId',
  path: 'path',
  width: 58,
  height: 67,
}

describe('ClippedImage', () => {
  it('should render the placeholder icon if no image', () => {
    const { queryByTestId } = render(<ClippedImage {...props} />)
    expect(queryByTestId('iconContainer')).not.toBeNull()
  })

  it('should not render the placeholder icon if image', () => {
    const { queryByTestId } = render(<ClippedImage {...props} image="uri" />)
    expect(queryByTestId('iconContainer')).toBeNull()
  })
})
