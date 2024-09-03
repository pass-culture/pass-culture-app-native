import React from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { fireEvent, render, screen } from 'tests/utils'

const mockCloseModal = jest.fn()

jest.mock('libs/subcategories/useSubcategory')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('ReactionChoiceModal', () => {
  it('should activate J’aime button when pressing it and it is deactivated', () => {
    render(
      <ReactionChoiceModal
        offer={mockOffer}
        dateUsed="2023-05-30"
        visible
        closeModal={mockCloseModal}
      />
    )

    fireEvent.press(screen.getByText('J’aime'))

    expect(screen.queryByTestId('thumbUp')).not.toBeOnTheScreen()
    expect(screen.getByTestId('thumbUpFilled')).toBeOnTheScreen()
  })

  it('should deactivate J’aime button when pressing it and it is activated', () => {
    render(
      <ReactionChoiceModal
        offer={mockOffer}
        dateUsed="2023-05-30"
        visible
        closeModal={mockCloseModal}
      />
    )

    fireEvent.press(screen.getByText('J’aime'))
    fireEvent.press(screen.getByText('J’aime'))

    expect(screen.getByTestId('thumbUp')).toBeOnTheScreen()
    expect(screen.queryByTestId('thumbUpFilled')).not.toBeOnTheScreen()
  })

  it('should activate Je n’aime pas button when pressing it and it is deactivated', () => {
    render(
      <ReactionChoiceModal
        offer={mockOffer}
        dateUsed="2023-05-30"
        visible
        closeModal={mockCloseModal}
      />
    )

    fireEvent.press(screen.getByText('Je n’aime pas'))

    expect(screen.queryByTestId('thumbDown')).not.toBeOnTheScreen()
    expect(screen.getByTestId('thumbDownFilled')).toBeOnTheScreen()
  })

  it('should deactivate Je n’aime pas button when pressing it and it is activated', () => {
    render(
      <ReactionChoiceModal
        offer={mockOffer}
        dateUsed="2023-05-30"
        visible
        closeModal={mockCloseModal}
      />
    )

    fireEvent.press(screen.getByText('Je n’aime pas'))
    fireEvent.press(screen.getByText('Je n’aime pas'))

    expect(screen.getByTestId('thumbDown')).toBeOnTheScreen()
    expect(screen.queryByTestId('thumbDownFilled')).not.toBeOnTheScreen()
  })

  it('should reset the buttons when closing modal', () => {
    render(
      <ReactionChoiceModal
        offer={mockOffer}
        dateUsed="2023-05-30"
        visible
        closeModal={mockCloseModal}
      />
    )

    fireEvent.press(screen.getByText('J’aime'))

    fireEvent.press(screen.getByTestId('Fermer la modale'))

    expect(screen.getByTestId('thumbDown')).toBeOnTheScreen()
  })

  it('should close the modal when pressing close icon', () => {
    render(
      <ReactionChoiceModal
        offer={mockOffer}
        dateUsed="2023-05-30"
        visible
        closeModal={mockCloseModal}
      />
    )

    fireEvent.press(screen.getByTestId('Fermer la modale'))

    expect(mockCloseModal).toHaveBeenCalledTimes(1)
  })

  it('should save reaction when click on reaction button', () => {
    const mockHandleSave = jest.fn()
    render(
      <ReactionChoiceModal
        offer={mockOffer}
        dateUsed="2023-05-30"
        visible
        closeModal={mockCloseModal}
        onSave={mockHandleSave}
      />
    )

    fireEvent.press(screen.getByText('J’aime'))
    fireEvent.press(screen.getByTestId('Valider la réaction'))

    expect(mockHandleSave).toHaveBeenCalledWith({
      offerId: mockOffer.id,
      reactionType: ReactionTypeEnum.LIKE,
    })
  })
})
