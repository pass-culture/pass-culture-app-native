import React, { createRef } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { ReactTestInstance } from 'react-test-renderer'

import { navigate } from '__mocks__/@react-navigation/native'
import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { render, screen, userEvent } from 'tests/utils'

import { ChronicleCardListBase } from './ChronicleCardListBase'

const user = userEvent.setup()

jest.useFakeTimers()

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

  it('should display "Voir plus" button on all cards when shouldShowSeeMoreButton is true and offerId defined', () => {
    render(
      <ChronicleCardListBase
        data={chroniclesSnap}
        offset={CHRONICLE_CARD_WIDTH}
        horizontal
        ref={ref}
        shouldShowSeeMoreButton
        offerId={1}
      />
    )

    expect(screen.getAllByText('Voir plus')).toHaveLength(10)
  })

  it('should not display "Voir plus" button on all cards when shouldShowSeeMoreButton is not defined', () => {
    render(
      <ChronicleCardListBase
        data={chroniclesSnap}
        offset={CHRONICLE_CARD_WIDTH}
        horizontal
        ref={ref}
      />
    )

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should not display "Voir plus" button on all cards when offerId is not defined', () => {
    render(
      <ChronicleCardListBase
        data={chroniclesSnap}
        offset={CHRONICLE_CARD_WIDTH}
        horizontal
        ref={ref}
        shouldShowSeeMoreButton
      />
    )

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should navigate to chronicles page with anchor on the selected chronicle when pressing "Voir plus" button', async () => {
    render(
      <ChronicleCardListBase
        data={chroniclesSnap}
        offset={CHRONICLE_CARD_WIDTH}
        horizontal
        ref={ref}
        shouldShowSeeMoreButton
        offerId={1}
      />
    )

    const seeMoreButtons = screen.getAllByText('Voir plus')

    // Using as because links is never undefined and the typing is not correct
    await user.press(seeMoreButtons[2] as ReactTestInstance)

    expect(navigate).toHaveBeenNthCalledWith(1, 'Chronicles', { offerId: 1, chronicleId: 3 })
  })
})
