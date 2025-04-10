import React from 'react'

import { FavoriteResponse } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { StickyFooterContent } from 'features/offer/components/OfferContent/StickyFooterContent/StickyFooterContent.web'
import { render, screen } from 'tests/utils/web'
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
    favorite      | expectedButtonText
    ${null}       | ${'Mettre en favori'}
    ${'not null'} | ${'Retirer des favoris'}
  `(
    'should render favorites button with text `$expectedButtonText` when favorite props is $favorite',
    async ({ favorite, expectedButtonText }) => {
      renderStickyFooterContent({
        favorite: favorite ? favoriteResponseSnap : favorite,
      })

      expect(await screen.findByText(expectedButtonText)).toBeInTheDocument()
    }
  )

  it('should render favoriteAuthModal properly', async () => {
    renderStickyFooterContent({
      favoriteAuthModal: { ...defaultModalSettings, visible: true },
    })

    await screen.findByText('Mettre en favori')

    expect(await screen.findByText('Identifie-toi pour retrouver tes favoris')).toBeInTheDocument()
  })
})

const renderStickyFooterContent = ({
  favorite = null,
  favoriteAuthModal = defaultModalSettings,
}: {
  favorite?: FavoriteResponse | null
  favoriteAuthModal?: ModalSettings
}) => {
  return render(
    <StickyFooterContent
      offerId={1}
      favorite={favorite}
      onPressFavoriteCTA={jest.fn()}
      isAddFavoriteLoading={false}
      isRemoveFavoriteLoading={false}
      hasReminder={false}
      onPressReminderCTA={jest.fn()}
      favoriteAuthModal={favoriteAuthModal}
      reminderAuthModal={defaultModalSettings}
    />
  )
}
