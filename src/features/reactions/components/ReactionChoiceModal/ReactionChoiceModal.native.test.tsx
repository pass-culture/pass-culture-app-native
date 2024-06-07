import React from 'react'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { fireEvent, render, screen } from 'tests/utils'

const mockCloseModal = jest.fn()

jest.mock('libs/subcategories/useSubcategory')

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
})
