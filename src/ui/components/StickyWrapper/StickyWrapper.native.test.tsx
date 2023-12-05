import React from 'react'

import { render, screen } from 'tests/utils'
import { StickyWrapper } from 'ui/components/StickyWrapper/StickyWrapper'

describe('<StickyWrapper />', () => {
  it('should be sitcky to the bottom', () => {
    render(<StickyWrapper testID="sticky-wrapper" />)

    expect(screen.getByTestId('sticky-wrapper')).toHaveStyle({
      position: 'absolute',
      bottom: 0,
      width: '100%',
    })
  })
})
