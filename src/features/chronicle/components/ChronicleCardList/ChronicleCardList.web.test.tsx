import React from 'react'

import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { fireEvent, render, screen, waitFor } from 'tests/utils/web'

import { ChronicleCardList } from './ChronicleCardList'

describe('ChronicleCardList', () => {
  it('should render the ChronicleCardList correctly', () => {
    render(<ChronicleCardList data={chroniclesSnap} />)

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeInTheDocument()
    expect(screen.getByText('L’Art de la Cuisine')).toBeInTheDocument()
  })

  it('should render the ChronicleCardList with horizontal mode', () => {
    render(<ChronicleCardList data={chroniclesSnap} />)

    expect(screen.getByTestId('chronicle-list-right-arrow')).toBeInTheDocument()
  })

  it('should render the ChronicleCardList with vertical mode', () => {
    render(<ChronicleCardList data={chroniclesSnap} horizontal={false} />)

    expect(screen.queryByTestId('chronicle-list-left-arrow')).not.toBeInTheDocument()
    expect(screen.queryByTestId('chronicle-list-right-arrow')).not.toBeInTheDocument()
  })

  it('should go to next page when right arrow is pressed', () => {
    render(<ChronicleCardList data={chroniclesSnap} horizontal />)

    fireEvent.click(screen.getByTestId('chronicle-list-right-arrow'))

    // 2 item
    expect(screen.getByText('L’Art de la Cuisine')).toBeInTheDocument()
    // 11 item
    expect(screen.queryByText('L’Odyssée des Espèces')).not.toBeInTheDocument()
  })

  it('should go to previous page when left arrow is pressed', async () => {
    render(<ChronicleCardList data={chroniclesSnap} horizontal />)

    const listElement = screen.getByTestId('chronicle-list')
    Object.defineProperty(listElement, 'scrollWidth', { get: () => 900 })
    Object.defineProperty(listElement, 'offsetWidth', { get: () => 300 })

    fireEvent.click(screen.getByTestId('chronicle-list-right-arrow'))
    // We have to force scroll event. onScroll is not triggered when using scrollToOffset via ref
    fireEvent.scroll(listElement)

    await screen.findByTestId('chronicle-list-left-arrow')

    fireEvent.click(screen.getByTestId('chronicle-list-left-arrow'))
    fireEvent.scroll(listElement)

    await waitFor(() => {
      expect(screen.getByText('Le Voyage Extraordinaire')).toBeInTheDocument()
      expect(screen.getByText('Explorateur du monde')).toBeInTheDocument()
    })
  })

  it('should disable the left arrow when on the first item', () => {
    render(<ChronicleCardList data={chroniclesSnap} horizontal />)

    // Ensure that the left arrow is not clickable on the first item
    expect(screen.queryByTestId('chronicle-list-left-arrow')).not.toBeInTheDocument()
  })

  it('should disable the right arrow when on the last item', async () => {
    render(<ChronicleCardList data={chroniclesSnap.slice(0, 2)} horizontal />)

    const listElement = screen.getByTestId('chronicle-list')
    Object.defineProperty(listElement, 'scrollWidth', { get: () => 900 })
    Object.defineProperty(listElement, 'offsetWidth', { get: () => 300 })

    fireEvent.scroll(listElement, {
      target: { scrollLeft: 600 },
    })

    await waitFor(() =>
      expect(screen.queryByTestId('chronicle-list-right-arrow')).not.toBeInTheDocument()
    )
  })
})
