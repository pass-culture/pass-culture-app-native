import React from 'react'

import { render, screen, waitFor, fireEvent, act } from 'tests/utils/web'

import { OfferPreviewModal } from './OfferPreviewModal'

describe('<OfferPreviewModal />', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {})
  })

  it('should display offer preview modal correctly with several images', async () => {
    render(
      <OfferPreviewModal
        isVisible
        offerImages={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
      />
    )

    await waitFor(() => expect(screen.getByTestId('fullscreenModalView')).toBeInTheDocument())

    expect(screen.getByRole('button', { name: 'Image précédente' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Image suivante' })).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
    expect(screen.getAllByTestId(/__CAROUSEL_ITEM_/)).toHaveLength(3)
  })

  it('should display offer preview modal correctly with one image', async () => {
    render(<OfferPreviewModal isVisible offerImages={['image1']} hideModal={jest.fn()} />)

    await waitFor(() => expect(screen.getByTestId('fullscreenModalView')).toBeInTheDocument())

    expect(screen.queryByRole('button', { name: 'Image précédente' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Image suivante' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('offerImageContainerCarousel')).not.toBeInTheDocument()
  })

  it('should start at specific index', async () => {
    render(
      <OfferPreviewModal
        isVisible
        offerImages={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
        defaultIndex={1}
      />
    )

    await waitFor(() => expect(screen.getByText('2/3')).toBeInTheDocument())
  })

  it('should display next image', async () => {
    render(
      <OfferPreviewModal
        isVisible
        offerImages={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
      />
    )

    act(() => fireEvent.click(screen.getByRole('button', { name: 'Image suivante' })))

    await waitFor(() => expect(screen.getByText('2/3')).toBeInTheDocument())
  })

  it('should display previous image', async () => {
    render(
      <OfferPreviewModal
        isVisible
        offerImages={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
        defaultIndex={2}
      />
    )

    act(() => fireEvent.click(screen.getByRole('button', { name: 'Image précédente' })))

    await waitFor(() => expect(screen.getByText('2/3')).toBeInTheDocument())
  })

  it('should close modal on click on close button', async () => {
    const mockOnClose = jest.fn()
    render(
      <OfferPreviewModal
        isVisible
        offerImages={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
        onClose={mockOnClose}
      />
    )

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Fermer la fenêtre' })).toBeInTheDocument()
    )
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Fermer la fenêtre' })))

    expect(mockOnClose).toHaveBeenCalledWith()
  })
})
