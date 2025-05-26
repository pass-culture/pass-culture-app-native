import React, { createRef } from 'react'
import { SharedValue } from 'react-native-reanimated'
import { ICarouselInstance } from 'react-native-reanimated-carousel'

import { render, screen } from 'tests/utils'
import { CarouselPagination } from 'ui/components/CarouselPagination/CarouselPagination'

const PROGRESS_VALUE = { value: 0 } as SharedValue<number>

describe('<CarouselPagination />', () => {
  const ref = createRef<ICarouselInstance>()

  it('should display dots', () => {
    render(
      <CarouselPagination
        gap={2}
        progressValue={PROGRESS_VALUE}
        elementsCount={2}
        carouselRef={ref}
      />
    )

    expect(screen.getAllByTestId('carousel-dot')).toHaveLength(2)
  })
})
