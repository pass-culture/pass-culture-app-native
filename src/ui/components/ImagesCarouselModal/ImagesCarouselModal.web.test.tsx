import React from 'react'

import { act, fireEvent, render, screen, waitFor } from 'tests/utils/web'

import { ImagesCarouselModal } from './ImagesCarouselModal'
jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<ImagesCarouselModal />', () => {
  let mockCallback: (
    entries: {
      target: HTMLElement
      contentRect: Partial<DOMRectReadOnly>
    }[]
  ) => void

  beforeAll(() => {
    const mockResizeObserver = jest.fn().mockImplementation((callback) => {
      mockCallback = callback
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      }
    })

    global.ResizeObserver = mockResizeObserver
  })

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  const forceOnLayout = async () => {
    // Simuler un changement de taille
    const view = screen.getByTestId('modalContainer')
    Object.defineProperties(view, {
      offsetHeight: { value: 600 },
      offsetWidth: { value: 800 },
      offsetLeft: { value: 10 },
      offsetTop: { value: 20 },
      offsetParent: { value: null },
    })

    await act(async () => {
      if (mockCallback) {
        mockCallback([
          {
            target: view,
            contentRect: { width: 500, height: 200, top: 0, left: 0 },
          },
        ])
      }
    })
  }

  it('should display offer preview modal correctly with several images', async () => {
    render(
      <ImagesCarouselModal
        isVisible
        imagesURL={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
      />
    )

    await forceOnLayout()

    await screen.findByTestId('imagesCarouselContainer')

    expect(screen.getByRole('button', { name: 'Image précédente' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Image suivante' })).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
    expect(screen.getAllByLabelText(/Image [0-9]/)).toHaveLength(3)
  })

  it('should display offer preview modal correctly with one image', async () => {
    render(<ImagesCarouselModal isVisible imagesURL={['image1']} hideModal={jest.fn()} />)

    await waitFor(() => expect(screen.getByTestId('fullscreenModalView')).toBeInTheDocument())

    expect(screen.queryByRole('button', { name: 'Image précédente' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Image suivante' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('imagesCarouselContainer')).not.toBeInTheDocument()
  })

  it('should start at specific index', async () => {
    jest.useFakeTimers()
    render(
      <ImagesCarouselModal
        isVisible
        imagesURL={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
        defaultIndex={1}
      />
    )

    await forceOnLayout()

    await act(async () => {
      jest.advanceTimersByTime(500)
    })

    expect(screen.getByText('2/3')).toBeInTheDocument()
  })

  it('should display next image', async () => {
    jest.useFakeTimers()
    render(
      <ImagesCarouselModal
        isVisible
        imagesURL={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
      />
    )

    await forceOnLayout()
    await screen.findByTestId('imagesCarouselContainer')

    fireEvent.click(await screen.findByTestId('Image suivante'))

    await act(async () => {
      jest.advanceTimersByTime(500)
    })

    expect(await screen.findByText('2/3')).toBeInTheDocument()
  })

  it('should display previous image', async () => {
    jest.useFakeTimers()
    render(
      <ImagesCarouselModal
        isVisible
        imagesURL={['image1', 'image2', 'image3']}
        hideModal={jest.fn()}
        defaultIndex={2}
      />
    )

    await forceOnLayout()

    await screen.findByText('3/3')

    fireEvent.click(screen.getByTestId('Image précédente'))

    await act(async () => {
      jest.advanceTimersByTime(500)
    })

    expect(await screen.findByText('2/3')).toBeInTheDocument()
  })

  it('should close modal on click on close button', async () => {
    jest.useFakeTimers()
    const mockOnClose = jest.fn()
    render(
      <ImagesCarouselModal
        isVisible
        imagesURL={['image1', 'image2', 'image3']}
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
