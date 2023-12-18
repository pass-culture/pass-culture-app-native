import React from 'react'

import { render, screen } from 'tests/utils'
import { StickyBottomWrapper } from 'ui/components/StickyBottomWrapper/StickyBottomWrapper'

describe('<StickyBottomWrapper />', () => {
  it('should be sitcky to the bottom', () => {
    render(<StickyBottomWrapper testID="sticky-wrapper" />)

    expect(screen.getByTestId('sticky-wrapper')).toHaveStyle({
      position: 'absolute',
      bottom: 0,
      width: '100%',
    })
  })
})
