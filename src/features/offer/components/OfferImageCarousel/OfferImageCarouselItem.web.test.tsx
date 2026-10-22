import React from 'react'

import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'
import * as useHandleFocusModule from 'libs/hooks/useHandleFocus'
import { fireEvent, render, screen } from 'tests/utils/web'

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
  it('should trigger focus change and focus when focus in native', () => {
    render(<OfferImageCarouselItem {...defaultProps} onFocusChange={mockOnFocusChange} />)

    const button = screen.getByRole('button')
    fireEvent.focus(button)

    expect(mockOnFocus).toHaveBeenCalledWith()
    expect(mockOnFocusChange).toHaveBeenCalledWith(true)
  })

  it('should trigger focus change and blur when blur in native', () => {
    render(<OfferImageCarouselItem {...defaultProps} onFocusChange={mockOnFocusChange} />)

    const button = screen.getByRole('button')
    fireEvent.blur(button)

    expect(mockOnBlur).toHaveBeenCalledWith()
    expect(mockOnFocusChange).toHaveBeenCalledWith(false)
  })

  it('should toggle inert attribute according to item active state', () => {
    const { container, rerender } = render(
      <OfferImageCarouselItem {...defaultProps} isActive={false} />
    )

    const slideElement = container.firstChild as HTMLElement

    expect(slideElement.hasAttribute('inert')).toBe(true)

    rerender(<OfferImageCarouselItem {...defaultProps} isActive />)

    expect(slideElement.hasAttribute('inert')).toBe(false)
  })
})
