import React from 'react'

import { AdviceCardList } from 'features/advices/components/AdviceCardList/AdviceCardList'
import { advicesFixture } from 'features/advices/fixtures/advices.fixture'
import { AdviceCardListProps } from 'features/advices/types'
import { fireEvent, render, screen, waitFor } from 'tests/utils/web'

describe('AdviceCardList', () => {
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
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const forceLayout = async () => {
    const list = await screen.findByTestId('advice-list')
    const listParent = list.parentElement

    if (!listParent) {
      return
    }

    Object.defineProperties(listParent, {
      offsetHeight: { value: 400 },
      offsetWidth: { value: 400 },
    })

    Object.defineProperties(list, {
      scrollWidth: { value: 4000 },
      offsetWidth: { value: 400 },
    })

    mockCallback([
      {
        target: listParent,
        contentRect: { width: 4000, height: 400, top: 0, left: 0 },
      },
    ])
  }

  it('should render the AdviceCardList correctly', async () => {
    renderAdviceList()
    await forceLayout()

    const listElement = screen.getByTestId('advice-list')
    fireEvent.scroll(listElement)

    await screen.findByTestId('advice-list-right-arrow')

    expect(await screen.findByText('Le Voyage Extraordinaire')).toBeInTheDocument()
    expect(await screen.findByText('L’Art de la Cuisine')).toBeInTheDocument()
  })

  it('should render the AdviceCardList in horizontal mode', async () => {
    renderAdviceList()
    await forceLayout()

    const listElement = screen.getByTestId('advice-list')
    fireEvent.scroll(listElement)

    expect(await screen.findByTestId('advice-list-right-arrow')).toBeInTheDocument()
  })

  it('should render the AdviceCardList in vertical mode', async () => {
    renderAdviceList({ horizontal: false })

    await screen.findByText(advicesFixture.at(0)?.title ?? '')

    expect(screen.queryByTestId('advice-list-left-arrow')).not.toBeInTheDocument()
    expect(screen.queryByTestId('advice-list-right-arrow')).not.toBeInTheDocument()
  })

  it('should go to next page when right arrow is pressed', async () => {
    renderAdviceList()
    await forceLayout()

    const listElement = screen.getByTestId('advice-list')
    fireEvent.scroll(listElement)

    await screen.findByTestId('advice-list-right-arrow')

    fireEvent.click(screen.getByTestId('advice-list-right-arrow'))

    // 2 item

    expect(await screen.findByText('L’Art de la Cuisine')).toBeInTheDocument()

    // 11 item
    expect(screen.queryByText('L’Odyssée des Espèces')).not.toBeInTheDocument()
  })

  it('should go to previous page when left arrow is pressed', async () => {
    renderAdviceList()
    await forceLayout()

    const listElement = screen.getByTestId('advice-list')
    fireEvent.scroll(listElement)

    await screen.findByTestId('advice-list-right-arrow')

    fireEvent.click(screen.getByTestId('advice-list-right-arrow'))
    // We have to force scroll event. onScroll is not triggered when using scrollToOffset via ref
    fireEvent.scroll(listElement, { target: { scrollLeft: 300 } })

    fireEvent.click(await screen.findByTestId('advice-list-left-arrow'))
    fireEvent.scroll(listElement, { target: { scrollLeft: 0 } })

    expect(await screen.findByText('Le Voyage Extraordinaire')).toBeInTheDocument()
    expect(await screen.findByText('Explorateur du monde')).toBeInTheDocument()
  })

  it('should disable the left arrow when on the first item', async () => {
    renderAdviceList()
    await forceLayout()

    // Ensure that the left arrow is not clickable on the first item
    expect(screen.queryByTestId('advice-list-left-arrow')).not.toBeInTheDocument()
  })

  it('should disable the right arrow when on the last item', async () => {
    renderAdviceList({ data: advicesFixture.slice(0, 2) })
    await forceLayout()

    const listElement = screen.getByTestId('advice-list')
    fireEvent.scroll(listElement, {
      target: { scrollLeft: 800 },
    })

    await waitFor(() => {
      expect(screen.queryByTestId('advice-list-right-arrow')).not.toBeInTheDocument()
    })
  })
})

const renderAdviceList = async (props?: Partial<AdviceCardListProps>) => {
  render(<AdviceCardList {...props} data={props?.data || advicesFixture} />)
}
