import React from 'react'

import { render, screen } from 'tests/utils'
import { BlurryWrapper } from 'ui/components/BlurryWrapper/BlurryWrapper'

describe('<BlurryWrapper />', () => {
  it('should display correctly the blur', () => {
    render(<BlurryWrapper />)

    expect(screen.getByTestId('blurry-wrapper')).toHaveStyle({ backgroundColor: 'transparent' })
  })
})
