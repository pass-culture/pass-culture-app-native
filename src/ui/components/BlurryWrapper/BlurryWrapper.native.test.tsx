import React from 'react'

import { render, screen } from 'tests/utils'
import { BlurryWrapper } from 'ui/components/BlurryWrapper/BlurryWrapper'

// TODO(PC-37604): Implement back blur effect for iOS at least
describe('<BlurryWrapper />', () => {
  it.skip('should apply default blur amount when no prop is provided', () => {
    render(<BlurryWrapper />)

    const blurryWrapper = screen.getByTestId('blurry-wrapper')

    expect(blurryWrapper.props.blurAmount).toEqual(5)
  })

  it.skip('should apply light blur amount when blurAmount is set to LIGHT', () => {
    render(<BlurryWrapper />)

    const blurryWrapper = screen.getByTestId('blurry-wrapper')

    expect(blurryWrapper.props.blurAmount).toEqual(5)
  })

  it.skip('should apply intense blur amount when blurAmount is set to INTENSE', () => {
    render(<BlurryWrapper />)

    const blurryWrapper = screen.getByTestId('blurry-wrapper')

    expect(blurryWrapper.props.blurAmount).toEqual(15)
  })
})
