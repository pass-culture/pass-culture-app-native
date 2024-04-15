import React from 'react'

import { render, screen } from 'tests/utils'
import { CarouselDot } from 'ui/CarouselDot/CarouselDot'

jest.useFakeTimers()

describe('<CarouselDot/>', () => {
  it('should render carousel dot', () => {
    render(<CarouselDot index={0} animValue={{ value: 3 }} />)

    expect(screen.getByTestId('carousel-dot')).toBeOnTheScreen()
  })

  it('should render with correct styles', () => {
    render(<CarouselDot index={0} animValue={{ value: 3 }} />)

    expect(screen.getByTestId('carousel-dot')).toHaveStyle({
      backgroundColor: 'rgba(105, 106, 111, 1)',
    })
    expect(screen.getByTestId('carousel-dot')).toHaveStyle({
      width: 6,
    })
  })
})
