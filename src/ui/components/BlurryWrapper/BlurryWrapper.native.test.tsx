import React from 'react'

import { render, screen } from 'tests/utils'
import { BlurAmount } from 'ui/components/BlurryWrapper/BlurAmount'
import { BlurryWrapper } from 'ui/components/BlurryWrapper/BlurryWrapper'

describe('<BlurryWrapper />', () => {
  it('should apply default blur amount when no prop is provided', () => {
    render(<BlurryWrapper />)

    const blurryWrapper = screen.getByTestId('blurry-wrapper')

    expect(blurryWrapper.props.blurAmount).toEqual(5)
  })

  it('should apply light blur amount when blurAmount is set to LIGHT', () => {
    render(<BlurryWrapper blurAmount={BlurAmount.LIGHT} />)

    const blurryWrapper = screen.getByTestId('blurry-wrapper')

    expect(blurryWrapper.props.blurAmount).toEqual(5)
  })

  it('should apply intense blur amount when blurAmount is set to INTENSE', () => {
    render(<BlurryWrapper blurAmount={BlurAmount.INTENSE} />)

    const blurryWrapper = screen.getByTestId('blurry-wrapper')

    expect(blurryWrapper.props.blurAmount).toEqual(15)
  })
})
