import React from 'react'

import { FavoriteResponse } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { StickyFooterContent } from 'features/offer/components/OfferContent/StickyFooterContent/StickyFooterContent'
import { render, screen } from 'tests/utils'
import { ModalSettings } from 'ui/components/modals/useModal'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const defaultModalSettings = {
  visible: false,
  showModal: jest.fn(),
  hideModal: jest.fn(),
  toggleModal: jest.fn(),
}

describe('StickyFooterContent', () => {
  it.each`
    hasReminder | expectedButtonText
    ${false}    | ${'Ajouter un rappel'}
    ${true}     | ${'Désactiver le rappel'}
  `(
    'should render reminder button with text `$expectedButtonText` when hasReminder props is $hasReminder',
    async ({ hasReminder, expectedButtonText }) => {
      renderStickyFooterContent({ hasReminder })

      expect(await screen.findByText(expectedButtonText)).toBeOnTheScreen()
    }
  )

  it.each`
    favorite      | expectedButtonText
    ${null}       | ${'Mettre en favori'}
    ${'not null'} | ${'Retirer des favoris'}
  `(
    'should render favorites button with text `$expectedButtonText` when favorite props is $favorite',
    async ({ favorite, expectedButtonText }) => {
      renderStickyFooterContent({
        favorite: favorite ? favoriteResponseSnap : favorite,
      })

      expect(await screen.findByText(expectedButtonText)).toBeOnTheScreen()
    }
  )

  it.each`
    authModal              | expectedModalText
    ${'favoriteAuthModal'} | ${'Identifie-toi pour retrouver tes favoris'}
    ${'reminderAuthModal'} | ${'Identifie-toi pour activer un rappel'}
  `('should render $authModal properly', async ({ authModal, expectedModalText }) => {
    renderStickyFooterContent({
      ...{ [authModal]: { ...defaultModalSettings, visible: true } },
    })

    expect(await screen.findByText(expectedModalText)).toBeOnTheScreen()
  })
})

const renderStickyFooterContent = ({
  favorite = null,
  favoriteAuthModal = defaultModalSettings,
  hasReminder = false,
  reminderAuthModal = defaultModalSettings,
}: {
  favorite?: FavoriteResponse | null
  favoriteAuthModal?: ModalSettings
  hasReminder?: boolean
  reminderAuthModal?: ModalSettings
}) => {
  return render(
    <StickyFooterContent
      offerId={1}
      favorite={favorite}
      onPressFavoriteCTA={jest.fn()}
      isAddFavoriteLoading={false}
      isRemoveFavoriteLoading={false}
      hasReminder={hasReminder}
      onPressReminderCTA={jest.fn()}
      favoriteAuthModal={favoriteAuthModal}
      reminderAuthModal={reminderAuthModal}
    />
  )
}
