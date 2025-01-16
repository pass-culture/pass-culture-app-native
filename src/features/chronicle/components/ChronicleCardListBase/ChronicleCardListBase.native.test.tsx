import React from 'react'

import { ChronicleCardListBase } from 'features/chronicle/components/ChronicleCardListBase/ChronicleCardListBase'
import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { render, screen } from 'tests/utils'

describe('ChronicleCardListBase', () => {
  it('should display all chronicle cards in the list', () => {
    render(<ChronicleCardListBase data={chroniclesSnap} horizontal />)

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeOnTheScreen()
  })

  it('should scroll to the correct page when indexItem is provided', () => {
    const indexItem = 3
    render(<ChronicleCardListBase data={chroniclesSnap} indexItem={indexItem} horizontal />)

    expect(screen.getByText('La Nature Sauvage')).toBeOnTheScreen()
  })

  it('should display vertical separators when horizontal is false', () => {
    render(<ChronicleCardListBase data={chroniclesSnap} horizontal={false} />)

    expect(screen.getAllByTestId('column-separator')).toHaveLength(10)
  })

  it('should display horizontal separators when horizontal is true', () => {
    render(<ChronicleCardListBase data={chroniclesSnap} horizontal />)

    expect(screen.getAllByTestId('row-separator')).toHaveLength(10)
  })
})
