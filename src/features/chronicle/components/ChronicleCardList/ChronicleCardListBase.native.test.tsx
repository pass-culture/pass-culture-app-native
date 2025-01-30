import React, { createRef } from 'react'
import { FlatList } from 'react-native-gesture-handler'

import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { render, screen } from 'tests/utils'

import { ChronicleCardListBase } from './ChronicleCardListBase'

describe('ChronicleCardListBase', () => {
  const ref = createRef<FlatList>()

  it('should display all chronicle cards in the list in horizontal', () => {
    render(<ChronicleCardListBase data={chroniclesSnap} horizontal separatorSize={10} ref={ref} />)

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeOnTheScreen()
  })

  it('should display all chronicle cards in the list in vertical', () => {
    render(<ChronicleCardListBase data={chroniclesSnap} separatorSize={20} ref={ref} />)

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeOnTheScreen()
  })

  it('should scroll to the correct page when offset is provided', () => {
    render(
      <ChronicleCardListBase
        data={chroniclesSnap}
        offset={CHRONICLE_CARD_WIDTH}
        horizontal
        ref={ref}
      />
    )

    expect(screen.getByText('La Nature Sauvage')).toBeOnTheScreen()
  })
})
