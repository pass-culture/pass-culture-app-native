import React from 'react'

import { render, screen } from 'tests/utils'
import { CarouselBar } from 'ui/CarouselBar/CarouselBar'

jest.useFakeTimers()

describe('<CarouselBar/>', () => {
  it('should render the component', () => {
    render(<CarouselBar index={0} animValue={{ value: 3 }} />)

    expect(screen.getByTestId('carousel-bar')).toBeOnTheScreen()
  })

  it('should render with correct styles', () => {
    render(<CarouselBar index={0} animValue={{ value: 3 }} />)
    const greyMedium = 'rgba(203, 205, 210, 1)'

    expect(screen.getByTestId('carousel-bar')).toHaveStyle({
      backgroundColor: greyMedium,
      width: 20,
    })
  })
})
