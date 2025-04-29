import React from 'react'
import { SharedValue } from 'react-native-reanimated'

import { render, screen } from 'tests/utils'
import { CarouselDot } from 'ui/components/CarouselDot/CarouselDot'

jest.useFakeTimers()

const ANIM_VALUE = { value: 3 } as SharedValue<number>

describe('<CarouselDot/>', () => {
  it('should render carousel dot', () => {
    render(<CarouselDot index={0} animValue={ANIM_VALUE} />)

    expect(screen.getByTestId('carousel-dot')).toBeOnTheScreen()
  })

  it('should render with correct styles', () => {
    render(<CarouselDot index={0} animValue={ANIM_VALUE} />)

    expect(screen.getByTestId('carousel-dot')).toHaveStyle({
      backgroundColor: 'rgba(105, 106, 111, 1)',
    })
    expect(screen.getByTestId('carousel-dot')).toHaveStyle({
      width: 6,
    })
  })
})
