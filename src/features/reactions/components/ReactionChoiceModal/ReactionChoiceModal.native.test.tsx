import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ReactionTypeEnum } from 'api/gen'
import { BookingsTab } from 'features/bookings/enum'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'

const mockCloseModal = jest.fn()

jest.mock('libs/subcategories/useSubcategory')
jest.mock('features/auth/context/AuthContext')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('ReactionChoiceModal', () => {
  it('should display body with validation when body type is validation', () => {
    renderReactionChoiceModal({})

    expect(screen.getByText('Partage-nous ton avis !')).toBeOnTheScreen()
  })

  it('should not display body with redirection when body type is validation', () => {
    renderReactionChoiceModal({})

    expect(
      screen.queryByText('Qu’as-tu pensé de tes dernières réservations ?')
    ).not.toBeOnTheScreen()
  })

  it('should display body with redirection when body type is redirection', () => {
    renderReactionChoiceModal({ bodyType: ReactionChoiceModalBodyEnum.REDIRECTION })

    expect(screen.getByText('Qu’as-tu pensé de tes dernières réservations ?')).toBeOnTheScreen()
  })

  it('should not display body with validation when body type is redirection', () => {
    renderReactionChoiceModal({ bodyType: ReactionChoiceModalBodyEnum.REDIRECTION })

    expect(screen.queryByText('Partage-nous ton avis !')).not.toBeOnTheScreen()
  })

  describe('With reaction validation', () => {
    it('should activate J’aime button when pressing it and it is deactivated', async () => {
      renderReactionChoiceModal({ from: ReactionFromEnum.ENDED_BOOKING })

      const likeButton = screen.getByText('J’aime')

      expect(likeButton).toHaveStyle({
        color: theme.designSystem.color.text.default,
      })

      await user.press(likeButton)

      expect(likeButton).toHaveStyle({
        color: theme.designSystem.color.text.brandPrimary,
      })
    })

    it('should activate Je n’aime pas button when pressing it and it is deactivated', async () => {
      renderReactionChoiceModal({ from: ReactionFromEnum.ENDED_BOOKING })

      const dislikeButton = screen.getByText('Je n’aime pas')

      expect(dislikeButton).toHaveStyle({
        color: theme.designSystem.color.text.default,
      })

      await user.press(dislikeButton)

      expect(dislikeButton).toHaveStyle({
        color: theme.designSystem.color.text.brandPrimary,
      })
    })

    it('should close the modal when pressing close icon', async () => {
      renderReactionChoiceModal({ from: ReactionFromEnum.ENDED_BOOKING })

      await user.press(screen.getByTestId('Fermer la modale'))

      expect(mockCloseModal).toHaveBeenCalledTimes(1)
    })

    it('should save reaction when click on reaction button', async () => {
      const mockHandleSave = jest.fn()
      renderReactionChoiceModal({ from: ReactionFromEnum.ENDED_BOOKING, onSave: mockHandleSave })

      await user.press(screen.getByText('J’aime'))
      await user.press(screen.getByTestId('Valider la réaction'))

      expect(mockHandleSave).toHaveBeenCalledWith({
        offerId: mockOffer.id,
        reactionType: ReactionTypeEnum.LIKE,
      })
    })

    it('should trigger ValidationReaction log when click on reaction button', async () => {
      const mockHandleSave = jest.fn()
      renderReactionChoiceModal({ from: ReactionFromEnum.ENDED_BOOKING, onSave: mockHandleSave })

      await user.press(screen.getByText('J’aime'))
      await user.press(screen.getByTestId('Valider la réaction'))

      expect(analytics.logValidateReaction).toHaveBeenCalledWith({
        offerId: mockOffer.id,
        reactionType: ReactionTypeEnum.LIKE,
        userId: 1234,
        from: ReactionFromEnum.ENDED_BOOKING,
      })
    })
  })

  describe('With redirection', () => {
    it('should close the modal when pressing close icon', async () => {
      renderReactionChoiceModal({ bodyType: ReactionChoiceModalBodyEnum.REDIRECTION })

      await user.press(screen.getByTestId('Fermer la modale'))

      expect(mockCloseModal).toHaveBeenCalledTimes(1)
    })

    it('should close the modal when pressing "Plus tard" button', async () => {
      renderReactionChoiceModal({ bodyType: ReactionChoiceModalBodyEnum.REDIRECTION })

      await user.press(screen.getByText('Plus tard'))

      expect(mockCloseModal).toHaveBeenCalledTimes(1)
    })

    it('should redirect to ended bookings when pressing "Donner mon avis" button', async () => {
      renderReactionChoiceModal({ bodyType: ReactionChoiceModalBodyEnum.REDIRECTION })

      await user.press(screen.getByText('Donner mon avis'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'Bookings', {
        activeTab: BookingsTab.COMPLETED,
      })
    })

    it('should close the modal when pressing "Donner mon avis" button', async () => {
      renderReactionChoiceModal({ bodyType: ReactionChoiceModalBodyEnum.REDIRECTION })

      await user.press(screen.getByText('Donner mon avis'))

      expect(mockCloseModal).toHaveBeenCalledTimes(1)
    })
  })
})

const renderReactionChoiceModal = ({
  onSave,
  from = ReactionFromEnum.HOME,
  bodyType = ReactionChoiceModalBodyEnum.VALIDATION,
}: {
  onSave?: VoidFunction
  from?: ReactionFromEnum
  bodyType?: ReactionChoiceModalBodyEnum
}) =>
  render(
    <ReactionChoiceModal
      offerId={mockOffer.id}
      offerName={mockOffer.name}
      imageUrl={mockOffer.images.image1.url}
      subcategoryId={mockOffer.subcategoryId}
      dateUsed="2023-05-30"
      visible
      closeModal={mockCloseModal}
      onSave={onSave}
      from={from}
      bodyType={bodyType}
    />
  )
