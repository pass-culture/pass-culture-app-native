import React from 'react'
import { SharedValue } from 'react-native-reanimated'

import { OfferImageCarouselDots } from 'features/offer/components/OfferImageCarouselDots/OfferImageCarouselDots'
import { render, screen } from 'tests/utils'

const PROGRESS_VALUE = { value: 0 } as SharedValue<number>

describe('<OfferImageCarouselDots />', () => {
  it('should display dots', () => {
    render(
      <OfferImageCarouselDots
        gap={2}
        progressValue={PROGRESS_VALUE}
        offerImages={['image1', 'image2']}
      />
    )

    expect(screen.getAllByTestId('carousel-dot')).toHaveLength(2)
  })
})
