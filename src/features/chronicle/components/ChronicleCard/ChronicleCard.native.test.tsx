import React from 'react'
import { View } from 'react-native'

import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { act, render, screen, userEvent } from 'tests/utils'
import { Button } from 'ui/designSystem/Button/Button'

import { ChronicleCard } from './ChronicleCard'

const mockOnLayoutWithButton = {
  nativeEvent: {
    layout: {
      height: 157,
    },
  },
}

const mockOnLayoutWithoutButton = {
  nativeEvent: {
    layout: {
      height: 30,
    },
  },
}

const user = userEvent.setup()
const mockOnSeeMoreButtonPress = jest.fn()
jest.useFakeTimers()

describe('ChronicleCard (Mobile)', () => {
  it('should render the ChronicleCard component with correct title', () => {
    render(
      <ChronicleCard {...chroniclesSnap[0]} shouldTruncate>
        <View>
          <Button
            wording="Voir plus"
            onPress={() => mockOnSeeMoreButtonPress(chroniclesSnap[0].id)}
            variant="tertiary"
            color="neutral"
          />
        </View>
      </ChronicleCard>
    )

    expect(screen.getByText(chroniclesSnap[0].title)).toBeOnTheScreen()
  })

  it('should display the "Voir plus" button if content overflows', async () => {
    render(
      <ChronicleCard {...chroniclesSnap[0]} shouldTruncate>
        <View>
          <Button
            wording="Voir plus"
            onPress={() => mockOnSeeMoreButtonPress(chroniclesSnap[0].id)}
            variant="tertiary"
            color="neutral"
          />
        </View>
      </ChronicleCard>
    )

    const description = screen.getByTestId('description')

    await act(async () => {
      description.props.onLayout(mockOnLayoutWithButton)
    })

    expect(screen.getByText('Voir plus')).toBeOnTheScreen()
  })

  it('should not display the "Voir plus" button if not content overflows', async () => {
    render(
      <ChronicleCard {...chroniclesSnap[0]} shouldTruncate>
        <View>
          <Button
            wording="Voir plus"
            onPress={() => mockOnSeeMoreButtonPress(chroniclesSnap[0].id)}
            variant="tertiary"
            color="neutral"
          />
        </View>
      </ChronicleCard>
    )

    const description = screen.getByTestId('description')

    await act(async () => {
      description.props.onLayout(mockOnLayoutWithoutButton)
    })

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should call onSeeMoreButtonPress when "Voir plus" is clicked', async () => {
    render(
      <ChronicleCard {...chroniclesSnap[0]} shouldTruncate>
        <View>
          <Button
            wording="Voir plus"
            onPress={() => mockOnSeeMoreButtonPress(chroniclesSnap[0].id)}
            variant="tertiary"
            color="neutral"
          />
        </View>
      </ChronicleCard>
    )

    const description = screen.getByTestId('description')

    await act(async () => {
      description.props.onLayout(mockOnLayoutWithButton)
    })

    await user.press(screen.getByText('Voir plus'))

    expect(mockOnSeeMoreButtonPress).toHaveBeenCalledTimes(1)
    expect(mockOnSeeMoreButtonPress).toHaveBeenCalledWith(chroniclesSnap[0].id)
  })
})
