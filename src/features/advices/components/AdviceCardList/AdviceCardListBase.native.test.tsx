import React, { createRef } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { ReactTestInstance } from 'react-test-renderer'

import { AdviceCardListBase } from 'features/advices/components/AdviceCardList/AdviceCardListBase'
import { ADVICE_CARD_WIDTH } from 'features/advices/constants'
import { advicesFixture } from 'features/advices/fixtures/advices.fixture'
import { act, render, screen, userEvent } from 'tests/utils'

const mockOnLayoutWithButton = {
  nativeEvent: {
    layout: {
      height: 157,
    },
  },
}

const user = userEvent.setup()

jest.useFakeTimers()

describe('AdviceCardListBase', () => {
  const ref = createRef<FlatList>()

  it('should display all advice cards in the list in horizontal', () => {
    render(<AdviceCardListBase data={advicesFixture} horizontal separatorSize={10} ref={ref} />)

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeOnTheScreen()
  })

  it('should display all advice cards in the list in vertical', () => {
    render(<AdviceCardListBase data={advicesFixture} separatorSize={20} ref={ref} />)

    expect(screen.getByText('Le Voyage Extraordinaire')).toBeOnTheScreen()
  })

  it('should scroll to the correct page when offset is provided', () => {
    render(
      <AdviceCardListBase data={advicesFixture} offset={ADVICE_CARD_WIDTH} horizontal ref={ref} />
    )

    expect(screen.getByText('La Nature Sauvage')).toBeOnTheScreen()
  })

  it('should display "Voir plus" button on all cards when onPressSeeMoreButton defined', async () => {
    render(
      <AdviceCardListBase
        data={advicesFixture}
        offset={ADVICE_CARD_WIDTH}
        horizontal
        ref={ref}
        onSeeMoreButtonPress={jest.fn()}
        shouldTruncate
      />
    )

    const descriptions = screen.getAllByTestId('description')

    await act(async () => {
      descriptions[0]?.props.onLayout(mockOnLayoutWithButton)
    })

    expect(screen.getAllByText('Voir plus')).toHaveLength(1)
  })

  it('should not display "Voir plus" button on all cards when onSeeMoreButtonPress not defined', () => {
    render(
      <AdviceCardListBase data={advicesFixture} offset={ADVICE_CARD_WIDTH} horizontal ref={ref} />
    )

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should handle onSeeMoreButtonPress when pressing "Voir plus" button', async () => {
    const mockOnSeeMoreButtonPress = jest.fn()
    render(
      <AdviceCardListBase
        data={advicesFixture}
        offset={ADVICE_CARD_WIDTH}
        horizontal
        ref={ref}
        onSeeMoreButtonPress={mockOnSeeMoreButtonPress}
        shouldTruncate
      />
    )

    const descriptions = screen.getAllByTestId('description')

    await act(async () => {
      descriptions[0]?.props.onLayout(mockOnLayoutWithButton)
    })

    const seeMoreButtons = screen.getAllByText('Voir plus')

    // Using as because links is never undefined and the typing is not correct
    await user.press(seeMoreButtons[0] as ReactTestInstance)

    expect(mockOnSeeMoreButtonPress).toHaveBeenCalledTimes(1)
  })
})
