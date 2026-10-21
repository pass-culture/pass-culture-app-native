import React from 'react'

import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'
import * as useHandleFocusModule from 'libs/hooks/useHandleFocus'
import { fireEvent, render, screen } from 'tests/utils'

const mockOnFocus = jest.fn()
const mockOnBlur = jest.fn()
jest.spyOn(useHandleFocusModule, 'useHandleFocus').mockReturnValue({
  onFocus: mockOnFocus,
  onBlur: mockOnBlur,
  isFocus: false,
})

const defaultProps = {
  index: 0,
  imageDimensions: {
    backgroundHeight: 250,
    imageStyle: {
      height: 200,
      width: 300,
      maxWidth: 300,
      aspectRatio: 1.5,
      borderRadius: 8,
    },
  },
  imageURL: 'https://example.com/image.jpg',
}

const mockOnFocusChange = jest.fn()

describe('OfferImageCarouselItem', () => {
  it('should not trigger focus change and focus when focus in native', () => {
    render(<OfferImageCarouselItem {...defaultProps} onFocusChange={mockOnFocusChange} />)

    const button = screen.getByRole('button')
    fireEvent(button, 'focus')

    expect(mockOnFocus).not.toHaveBeenCalled()
    expect(mockOnFocusChange).not.toHaveBeenCalled()
  })

  it('should not trigger focus change and blur when blur in native', () => {
    render(<OfferImageCarouselItem {...defaultProps} onFocusChange={mockOnFocusChange} />)

    const button = screen.getByRole('button')
    fireEvent(button, 'blur')

    expect(mockOnBlur).not.toHaveBeenCalled()
    expect(mockOnFocusChange).not.toHaveBeenCalled()
  })
})
