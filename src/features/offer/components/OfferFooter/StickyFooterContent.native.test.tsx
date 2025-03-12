import React from 'react'

import { FavoriteResponse } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { StickyFooterContent } from 'features/offer/components/OfferFooter/StickyFooterContent'
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
  describe('When user is not logged in', () => {
    it('should render properly', async () => {
      renderStickyFooterContent({})

      expect(await screen.findByText('Cette offre sera bientôt disponible')).toBeOnTheScreen()
      expect(await screen.findByText('Mettre en favori')).toBeOnTheScreen()
      expect(await screen.findByText('Ajouter un rappel')).toBeOnTheScreen()
    })

    it('should render favorite auth modal', async () => {
      renderStickyFooterContent({
        favoriteAuthModalSettings: { ...defaultModalSettings, visible: true },
      })

      await screen.findByText('Mettre en favori')

      expect(await screen.findByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
    })

    it('should render notifications auth modal', async () => {
      renderStickyFooterContent({
        notificationsAuthModalSettings: { ...defaultModalSettings, visible: true },
      })

      await screen.findByText('Ajouter un rappel')

      expect(await screen.findByText('Identifie-toi pour activer un rappel')).toBeOnTheScreen()
    })
  })

  describe('When user is logged in and has added offer to favorites', () => {
    it('should render properly', async () => {
      renderStickyFooterContent({ favorite: favoriteResponseSnap })

      expect(await screen.findByText('Cette offre sera bientôt disponible')).toBeOnTheScreen()
      expect(await screen.findByText('Retirer des favoris')).toBeOnTheScreen()
      expect(await screen.findByText('Ajouter un rappel')).toBeOnTheScreen()
    })
  })

  describe('When user is logged in, has added offer to favorites and has set notifications', () => {
    it('should render properly', async () => {
      renderStickyFooterContent({
        favorite: favoriteResponseSnap,
        hasEnabledNotifications: true,
      })

      expect(await screen.findByText('Cette offre sera bientôt disponible')).toBeOnTheScreen()
      expect(await screen.findByText('Retirer des favoris')).toBeOnTheScreen()
      expect(await screen.findByText('Désactiver le rappel')).toBeOnTheScreen()
    })
  })
})

const renderStickyFooterContent = ({
  favorite = null,
  favoriteAuthModalSettings = defaultModalSettings,
  hasEnabledNotifications = false,
  notificationsAuthModalSettings = defaultModalSettings,
}: {
  favorite?: FavoriteResponse | null
  favoriteAuthModalSettings?: ModalSettings
  hasEnabledNotifications?: boolean
  notificationsAuthModalSettings?: ModalSettings
}) => {
  return render(
    <StickyFooterContent
      offerId={1}
      favorite={favorite}
      onPressFavoriteCTA={jest.fn()}
      isAddFavoriteLoading={false}
      isRemoveFavoriteLoading={false}
      hasEnabledNotifications={hasEnabledNotifications}
      onPressNotificationsCTA={jest.fn()}
      favoriteAuthModal={favoriteAuthModalSettings}
      notificationAuthModal={notificationsAuthModalSettings}
    />
  )
}
