import React from 'react'
import { View } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { AdviceCard, AdviceCardProps } from 'features/advices/components/AdviceCard/AdviceCard'
import { advicesFixture } from 'features/advices/fixtures/advices.fixture'
import { act, render, screen, userEvent } from 'tests/utils'
import { Button } from 'ui/designSystem/Button/Button'
import { TagVariant } from 'ui/designSystem/Tag/types'

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

describe('AdviceCard (Mobile)', () => {
  it('should render the AdviceCard component with correct title', () => {
    renderAdviceCard()

    expect(screen.getByText(advicesFixture[0].title)).toBeOnTheScreen()
  })

  it('should display the "Voir plus" button if content overflows', async () => {
    renderAdviceCard()

    const description = screen.getByTestId('description')

    await act(async () => {
      description.props.onLayout(mockOnLayoutWithButton)
    })

    expect(screen.getByText('Voir plus')).toBeOnTheScreen()
  })

  it('should not display the "Voir plus" button if not content overflows', async () => {
    renderAdviceCard()

    const description = screen.getByTestId('description')

    await act(async () => {
      description.props.onLayout(mockOnLayoutWithoutButton)
    })

    expect(screen.queryByText('Voir plus')).not.toBeOnTheScreen()
  })

  it('should call onSeeMoreButtonPress when "Voir plus" is clicked', async () => {
    renderAdviceCard()

    const description = screen.getByTestId('description')

    await act(async () => {
      description.props.onLayout(mockOnLayoutWithButton)
    })

    await user.press(screen.getByText('Voir plus'))

    expect(mockOnSeeMoreButtonPress).toHaveBeenCalledTimes(1)
    expect(mockOnSeeMoreButtonPress).toHaveBeenCalledWith(advicesFixture[0].id)
  })

  it('should display right filled when navigation defined', () => {
    renderAdviceCard({
      headerNavigateTo: { screen: 'Offer', params: { id: 1 } },
      headerAccessibilityLabel: 'Voir l‘offre',
    })

    expect(screen.getByTestId('RightFilled')).toBeOnTheScreen()
  })

  it('should navigate when navigation defined and pressing header', async () => {
    renderAdviceCard({
      headerNavigateTo: { screen: 'Offer', params: { id: 1 } },
      headerAccessibilityLabel: 'Voir l‘offre',
    })

    await user.press(screen.getByLabelText('Voir l‘offre'))

    expect(navigate).toHaveBeenCalledWith('Offer', { id: 1 })
  })

  it('should display thumbnail when advice has an image', () => {
    renderAdviceCard({ image: 'imageUrl' })

    expect(screen.getByTestId('AdviceCardThumbnail')).toBeOnTheScreen()
  })

  it('should display custom tag when advice has tag props', () => {
    renderAdviceCard({ tagProps: { variant: TagVariant.PROEDITO, label: 'par Cédric' } })

    expect(screen.getByText('par Cédric')).toBeOnTheScreen()
  })
})

const renderAdviceCard = (customProps?: Partial<AdviceCardProps>) => {
  const props = { ...advicesFixture[0], shouldTruncate: true, ...customProps }

  return render(
    <AdviceCard {...props}>
      <View>
        <Button
          wording="Voir plus"
          onPress={() => mockOnSeeMoreButtonPress(props.id)}
          variant="tertiary"
          color="neutral"
        />
      </View>
    </AdviceCard>
  )
}
