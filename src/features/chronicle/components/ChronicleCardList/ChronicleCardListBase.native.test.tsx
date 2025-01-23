import React from 'react'

import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { render, screen } from 'tests/utils'

import { ChronicleCardListBase } from './ChronicleCardListBase'

describe('ChronicleCardListBase', () => {
  it('should display all chronicle cards in the list in horizontal', () => {
    render(<ChronicleCardListBase data={chroniclesSnap} horizontal separatorSize={10} />)

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeOnTheScreen()
  })

  it('should display all chronicle cards in the list in vertical', () => {
    render(<ChronicleCardListBase data={chroniclesSnap} separatorSize={20} />)

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeOnTheScreen()
  })

  it('should scroll to the correct page when offset is provided', () => {
    render(<ChronicleCardListBase data={chroniclesSnap} offset={CHRONICLE_CARD_WIDTH} horizontal />)

    expect(screen.getByText('La Nature Sauvage')).toBeOnTheScreen()
  })
})
