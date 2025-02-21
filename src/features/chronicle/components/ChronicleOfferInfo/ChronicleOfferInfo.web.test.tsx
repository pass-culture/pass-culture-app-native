import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { Button, Image as mockImage } from 'react-native'

import { render, screen } from 'tests/utils/web'

import { ChronicleOfferInfo } from './ChronicleOfferInfo.web'

jest.mock('libs/resizing-image-on-demand/FastImage', () => ({
  FastImage: mockImage,
}))

describe('ChronicleOfferInfo', () => {
  it('should render correctly', () => {
    render(<ChronicleOfferInfo imageUrl="http://image.jpeg" price="12€" title="lorem ipsum" />)

    expect(screen.getByText('12€')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
    expect(screen.getByTestId('imagePlaceholder')).toBeInTheDocument()
    expect(screen.getByTestId('offerImage')).toBeInTheDocument()
  })

  it('should at least render placeholder when there is no image', () => {
    render(<ChronicleOfferInfo imageUrl="" price="12€" title="lorem ipsum" />)

    expect(screen.getByText('12€')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
    expect(screen.getByTestId('imagePlaceholder')).toBeInTheDocument()
    expect(screen.queryByTestId('offerImage')).not.toBeInTheDocument()
  })

  it('should render correctly with custom children', () => {
    render(
      <ChronicleOfferInfo imageUrl="http://image.jpeg" price="12€" title="lorem ipsum">
        <Button testID="button" title="button" />
      </ChronicleOfferInfo>
    )

    expect(screen.getByText('12€')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByTestId('imagePlaceholder')).toBeInTheDocument()
    expect(screen.getByTestId('offerImage')).toBeInTheDocument()
  })
})
