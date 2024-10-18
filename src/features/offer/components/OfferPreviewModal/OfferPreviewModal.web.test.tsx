import React from 'react'

import { act, fireEvent, render, screen, waitFor } from 'tests/utils/web'

import { OfferPreviewModal } from './OfferPreviewModal'
jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('<OfferPreviewModal />', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('should display offer preview modal correctly with several images', async () => {
    render(
      <OfferPreviewModal
        isVisible
        offerImages={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
      />
    )

    await screen.findByAltText('Image 1')

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
    jest.useFakeTimers()
    render(
      <OfferPreviewModal
        isVisible
        offerImages={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
        defaultIndex={1}
      />
    )

    await act(async () => {
      jest.advanceTimersByTime(500)
    })

    expect(screen.getByText('2/3')).toBeInTheDocument()
  })

  it('should display next image', async () => {
    jest.useFakeTimers()
    render(
      <OfferPreviewModal
        isVisible
        offerImages={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
      />
    )

    const nextButton = await screen.findByTestId('Image suivante')
    fireEvent.click(nextButton)

    await act(async () => {
      jest.advanceTimersByTime(500)
    })

    expect(screen.getByText('2/3')).toBeInTheDocument()
  })

  it('should display previous image', async () => {
    jest.useFakeTimers()
    render(
      <OfferPreviewModal
        isVisible
        offerImages={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
        defaultIndex={2}
      />
    )

    await screen.findByText('3/3')

    const previousButton = screen.getByTestId('Image précédente')
    fireEvent.click(previousButton)

    await act(async () => {
      jest.advanceTimersByTime(500)
    })

    expect(screen.getByText('2/3')).toBeInTheDocument()
  })

  it('should close modal on click on close button', async () => {
    jest.useFakeTimers()
    const mockOnClose = jest.fn()
    render(
      <OfferPreviewModal
        isVisible
        offerImages={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
        onClose={mockOnClose}
      />
    )

    const closeButton = await screen.findByTestId('Fermer la fenêtre')
    fireEvent.click(closeButton)

    await act(async () => {
      jest.advanceTimersByTime(500)
    })

    expect(mockOnClose).toHaveBeenCalledWith()
  })
})
