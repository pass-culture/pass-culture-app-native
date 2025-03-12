import React from 'react'

import { FavoriteResponse } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { StickyFooterContent } from 'features/offer/components/OfferFooter/StickyFooterContent'
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
  describe('When user is not logged in', () => {
    it('should render properly', async () => {
      renderStickyFooterContent({})

      expect(await screen.findByText('Cette offre sera bientôt disponible')).toBeInTheDocument()
      expect(await screen.findByText('Mettre en favori')).toBeInTheDocument()
    })

    it('should render favorite auth modal', async () => {
      renderStickyFooterContent({
        favoriteAuthModalSettings: { ...defaultModalSettings, visible: true },
      })

      await screen.findByText('Mettre en favori')

      expect(
        await screen.findByText('Identifie-toi pour retrouver tes favoris')
      ).toBeInTheDocument()
    })
  })

  describe('When user is logged in and has added offer to favorites', () => {
    it('should render properly', async () => {
      renderStickyFooterContent({ favorite: favoriteResponseSnap })

      expect(await screen.findByText('Cette offre sera bientôt disponible')).toBeInTheDocument()
      expect(await screen.findByText('Retirer des favoris')).toBeInTheDocument()
    })
  })
})

const renderStickyFooterContent = ({
  favorite = null,
  favoriteAuthModalSettings = defaultModalSettings,
}: {
  favorite?: FavoriteResponse | null
  favoriteAuthModalSettings?: ModalSettings
}) => {
  return render(
    <StickyFooterContent
      offerId={1}
      favorite={favorite}
      onPressFavoriteCTA={jest.fn()}
      isAddFavoriteLoading={false}
      isRemoveFavoriteLoading={false}
      hasEnabledNotifications={false}
      onPressNotificationsCTA={jest.fn()}
      favoriteAuthModal={favoriteAuthModalSettings}
      notificationAuthModal={defaultModalSettings}
    />
  )
}
