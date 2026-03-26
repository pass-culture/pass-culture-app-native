import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { Button, Image as mockImage } from 'react-native'

import { ClubAdviceOfferInfo } from 'features/clubAdvices/components/ClubAdviceOfferInfo/ClubAdviceOfferInfo.web'
import { mockOfferImageDimensions } from 'features/offer/fixtures/offerImageDimensions'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/resizing-image-on-demand/FastImage', () => ({
  FastImage: mockImage,
}))

describe('ClubAdviceOfferInfo', () => {
  it('should render correctly', () => {
    render(
      <ClubAdviceOfferInfo
        imageUrl="http://image.jpeg"
        price="12€"
        title="lorem ipsum"
        imageDimensions={mockOfferImageDimensions}
      />
    )

    expect(screen.getByText('12€')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
    expect(screen.getByTestId('imagePlaceholder')).toBeInTheDocument()
    expect(screen.getByTestId('offerImage')).toBeInTheDocument()
  })

  it('should at least render placeholder when there is no image', () => {
    render(
      <ClubAdviceOfferInfo
        imageUrl=""
        price="12€"
        title="lorem ipsum"
        imageDimensions={mockOfferImageDimensions}
      />
    )

    expect(screen.getByText('12€')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
    expect(screen.getByTestId('imagePlaceholder')).toBeInTheDocument()
    expect(screen.queryByTestId('offerImage')).not.toBeInTheDocument()
  })

  it('should render correctly with custom children', () => {
    render(
      <ClubAdviceOfferInfo
        imageUrl="http://image.jpeg"
        price="12€"
        title="lorem ipsum"
        imageDimensions={mockOfferImageDimensions}>
        <Button testID="button" title="button" />
      </ClubAdviceOfferInfo>
    )

    expect(screen.getByText('12€')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByTestId('imagePlaceholder')).toBeInTheDocument()
    expect(screen.getByTestId('offerImage')).toBeInTheDocument()
  })
})
