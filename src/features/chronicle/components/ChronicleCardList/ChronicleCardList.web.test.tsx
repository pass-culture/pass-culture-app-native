import React from 'react'

import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList.web'
import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { fireEvent, render, screen } from 'tests/utils/web'

describe('ChronicleCardList', () => {
  it('should render the ChronicleCardList correctly with horizontal mode', () => {
    render(<ChronicleCardList data={chroniclesSnap} />)

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeInTheDocument()
    expect(screen.getByText('L’Art de la Cuisine')).toBeInTheDocument()

    expect(screen.getByTestId('chronicle-list-right-arrow')).toBeInTheDocument()
  })

  it('should render the ChronicleCardList correctly with vertical mode', () => {
    render(<ChronicleCardList data={chroniclesSnap} horizontal={false} />)

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeInTheDocument()

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

  it('should go to previous page when left arrow is pressed', () => {
    render(<ChronicleCardList data={chroniclesSnap} horizontal />)

    fireEvent.click(screen.getByTestId('chronicle-list-right-arrow'))

    fireEvent.click(screen.getByTestId('chronicle-list-left-arrow'))

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeInTheDocument()
    expect(screen.getByText('Explorateur du monde')).toBeInTheDocument()
  })

  it('should disable the left arrow when on the first item', () => {
    render(<ChronicleCardList data={chroniclesSnap} horizontal />)

    // Ensure that the left arrow is not clickable on the first item
    expect(screen.queryByTestId('chronicle-list-left-arrow')).not.toBeInTheDocument()
  })

  it('should disable the right arrow when on the last item', () => {
    render(<ChronicleCardList data={chroniclesSnap} horizontal />)

    const rightArrow = screen.getByTestId('chronicle-list-right-arrow')

    // Simulate clicks until the right arrow button is no longer visible
    while (rightArrow && rightArrow.isConnected) {
      fireEvent.click(rightArrow)
    }

    expect(screen.queryByTestId('chronicle-list-right-arrow')).not.toBeInTheDocument()
  })
})
