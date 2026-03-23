import React from 'react'
import { SharedValue } from 'react-native-reanimated'

import { render, screen } from 'tests/utils'
import { CarouselBar } from 'ui/components/CarouselBar/CarouselBar'

jest.useFakeTimers()

const ANIM_VALUE = { value: 3 } as SharedValue<number>

describe('<CarouselBar/>', () => {
  it('should render the component', () => {
    render(<CarouselBar index={0} animValue={ANIM_VALUE} />)

    expect(screen.getByTestId('carousel-bar')).toBeOnTheScreen()
  })
})
