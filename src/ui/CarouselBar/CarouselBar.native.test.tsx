import React from 'react'
import { SharedValue } from 'react-native-reanimated'

import { render, screen } from 'tests/utils'
import { CarouselBar } from 'ui/CarouselBar/CarouselBar'

jest.useFakeTimers()

const PROGRESS_VALUE = { value: 3 } as SharedValue<number>

describe('<CarouselBar/>', () => {
  it('should render the component', () => {
    render(<CarouselBar index={0} animValue={PROGRESS_VALUE} />)

    expect(screen.getByTestId('carousel-bar')).toBeOnTheScreen()
  })

  it('should render with correct styles', () => {
    render(<CarouselBar index={0} animValue={PROGRESS_VALUE} />)
    const greyMedium = 'rgba(203, 205, 210, 1)'

    expect(screen.getByTestId('carousel-bar')).toHaveStyle({
      backgroundColor: greyMedium,
      width: 20,
    })
  })
})
