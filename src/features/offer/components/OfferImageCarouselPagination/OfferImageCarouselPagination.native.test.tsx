import React from 'react'
import { SharedValue } from 'react-native-reanimated'

import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination'
import { render, screen } from 'tests/utils'

const PROGRESS_VALUE = { value: 0 } as SharedValue<number>

describe('<OfferImageCarouselPagination />', () => {
  it('should display pagination with only dots', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={PROGRESS_VALUE}
        offerImages={['image1', 'image2']}
        handlePressButton={jest.fn()}
      />
    )

    expect(screen.getByTestId('onlyDotsContainer')).toBeOnTheScreen()
  })

  it('should not display pagination with dots and buttons', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={PROGRESS_VALUE}
        offerImages={['image1', 'image2']}
        handlePressButton={jest.fn()}
      />
    )

    expect(screen.queryByTestId('buttonsAndDotsContainer')).not.toBeOnTheScreen()
  })
})
