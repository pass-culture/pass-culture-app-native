import React from 'react'
import { View } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { chroniclesSnap } from 'features/chronicle/fixtures/chroniclesSnap'
import { act, render, screen, userEvent } from 'tests/utils'
import { Button } from 'ui/designSystem/Button/Button'
import { TagVariant } from 'ui/designSystem/Tag/types'

import { ChronicleCard, ChronicleCardProps } from './ChronicleCard'

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
    renderChronicleCard()

    expect(screen.getByText(chroniclesSnap[0].title)).toBeOnTheScreen()
  })

  it('should display the "Voir plus" button if content overflows', async () => {
    renderChronicleCard()

    const description = screen.getByTestId('description')

    await act(async () => {
      description.props.onLayout(mockOnLayoutWithButton)
    })

    expect(screen.getByText('Voir plus')).toBeOnTheScreen()
  })

  it('should not display the "Voir plus" button if not content overflows', async () => {
    renderChronicleCard()

    const description = screen.getByTestId('description')

    await act(async () => {
      description.props.onLayout(mockOnLayoutWithoutButton)
    })

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should call onSeeMoreButtonPress when "Voir plus" is clicked', async () => {
    renderChronicleCard()

    const description = screen.getByTestId('description')

    await act(async () => {
      description.props.onLayout(mockOnLayoutWithButton)
    })

    await user.press(screen.getByText('Voir plus'))

    expect(mockOnSeeMoreButtonPress).toHaveBeenCalledTimes(1)
    expect(mockOnSeeMoreButtonPress).toHaveBeenCalledWith(chroniclesSnap[0].id)
  })

  it('should display right filled when navigation defined', () => {
    renderChronicleCard({
      headerNavigateTo: { screen: 'Offer', params: { id: 1 } },
      headerAccessibilityLabel: 'Voir l‘offre',
    })

    expect(screen.getByTestId('RightFilled')).toBeOnTheScreen()
  })

  it('should navigate when navigation defined and pressing header', async () => {
    renderChronicleCard({
      headerNavigateTo: { screen: 'Offer', params: { id: 1 } },
      headerAccessibilityLabel: 'Voir l‘offre',
    })

    await user.press(screen.getByLabelText('Voir l‘offre'))

    expect(navigate).toHaveBeenCalledWith('Offer', { id: 1 })
  })

  it('should display thumbnail when chronicle has an image', () => {
    renderChronicleCard({ image: 'imageUrl' })

    expect(screen.getByTestId('ChronicleCardThumbnail')).toBeOnTheScreen()
  })

  it('should display custom tag when chronicle has tag props', () => {
    renderChronicleCard({ tagProps: { variant: TagVariant.PROEDITO, label: 'par Cédric' } })

    expect(screen.getByText('par Cédric')).toBeOnTheScreen()
  })
})

const renderChronicleCard = (customProps?: Partial<ChronicleCardProps>) => {
  const props = { ...chroniclesSnap[0], shouldTruncate: true, ...customProps }

  return render(
    <ChronicleCard {...props}>
      <View>
        <Button
          wording="Voir plus"
          onPress={() => mockOnSeeMoreButtonPress(props.id)}
          variant="tertiary"
          color="neutral"
        />
      </View>
    </ChronicleCard>
  )
}
