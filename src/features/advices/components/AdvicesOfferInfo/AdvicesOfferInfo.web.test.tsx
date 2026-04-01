import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { Button, Image as mockImage } from 'react-native'

import { AdvicesOfferInfo } from 'features/advices/components/AdvicesOfferInfo/AdvicesOfferInfo.web'
import { mockOfferImageDimensions } from 'features/offer/fixtures/offerImageDimensions'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/resizing-image-on-demand/FastImage', () => ({
  FastImage: mockImage,
}))

describe('AdvicesOfferInfo', () => {
  it('should render correctly', () => {
    render(
      <AdvicesOfferInfo
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
      <AdvicesOfferInfo
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
      <AdvicesOfferInfo
        imageUrl="http://image.jpeg"
        price="12€"
        title="lorem ipsum"
        imageDimensions={mockOfferImageDimensions}>
        <Button testID="button" title="button" />
      </AdvicesOfferInfo>
    )

    expect(screen.getByText('12€')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByTestId('imagePlaceholder')).toBeInTheDocument()
    expect(screen.getByTestId('offerImage')).toBeInTheDocument()
  })
})
