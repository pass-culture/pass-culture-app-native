import React, { createRef } from 'react'

import { render, screen } from 'tests/utils'
import { CarouselPagination } from 'ui/components/CarouselPagination/CarouselPagination'

const PROGRESS_VALUE = 0

describe('<CarouselPagination />', () => {
  const ref = createRef<number>()

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
