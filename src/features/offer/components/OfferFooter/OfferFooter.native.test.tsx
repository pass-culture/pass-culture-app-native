import mockDate from 'mockdate'
import React from 'react'
import { Button } from 'react-native'

import * as Auth from 'features/auth/context/AuthContext'
import { favoriteOfferResponseSnap } from 'features/favorites/fixtures/favoriteOfferResponseSnap'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import * as useOfferCTAContextModule from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferFooter, OfferFooterProps } from 'features/offer/components/OfferFooter/OfferFooter'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useRemoteConfig from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

const useRemoteConfigSpy = jest.spyOn(useRemoteConfig, 'useRemoteConfig')

const useAuthContextSpy = jest.spyOn(Auth, 'useAuthContext')

const useOfferCTASpy = jest.spyOn(useOfferCTAContextModule, 'useOfferCTA')

const mockUseOfferCTAReturnValue = {
  wording: 'Cine content CTA',
  onPress: jest.fn(),
  setButton: jest.fn(),
  showButton: jest.fn(),
  isButtonVisible: false,
}

const mockAuthContextReturnValue = {
  isLoggedIn: false,
  isUserLoading: false,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
}

jest.useFakeTimers()
const user = userEvent.setup()

describe('OfferFooter', () => {
  beforeAll(() => {
    useRemoteConfigSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    useOfferCTASpy.mockReturnValue(mockUseOfferCTAReturnValue)
    useAuthContextSpy.mockReturnValue(mockAuthContextReturnValue)
  })

  describe('Content when offer is a movie screening', () => {
    beforeEach(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        showAccessScreeningButton: true,
      })
      useOfferCTASpy.mockReturnValue({
        ...mockUseOfferCTAReturnValue,
        isButtonVisible: true,
      })
    })

    it('should display cineContentCTA when remote config is on', async () => {
      renderOfferFooter({})

      expect(await screen.findByText('Cine content CTA')).toBeOnTheScreen()
    })
  })

  describe('Content when offer has a publication date in the future', () => {
    const CURRENT_DATE = new Date('2025-01-01T00:00:00.000Z')

    const offerWithPublicationDate = {
      ...offerResponseSnap,
      isReleased: false,
      publicationDate: '2025-04-01T14:15:00Z',
    }

    beforeEach(() => {
      mockDate.set(CURRENT_DATE)
      useRemoteConfigSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        showAccessScreeningButton: false,
      })
    })

    it('should display coming soon banner', async () => {
      renderOfferFooter({ offer: offerWithPublicationDate })

      expect(screen.getByText('Cette offre sera bientôt disponible')).toBeOnTheScreen()
    })

    it('should display addToFavorites button when offer has not been added to favorites', async () => {
      renderOfferFooter({ offer: offerWithPublicationDate, favorite: null })

      expect(screen.getByText('Mettre en favori')).toBeOnTheScreen()
    })

    it('should display removeFromFavorites button when offer has been added to favorites', async () => {
      renderOfferFooter({
        offer: offerWithPublicationDate,
        favorite: { id: favoriteOfferResponseSnap.id, offer: favoriteOfferResponseSnap },
      })

      expect(screen.getByText('Retirer des favoris')).toBeOnTheScreen()
    })

    it('should display enableNotifications button', async () => {
      renderOfferFooter({ offer: offerWithPublicationDate })

      expect(screen.getByText('Ajouter un rappel')).toBeOnTheScreen()
    })

    it('should display disableNotifications button', async () => {
      useAuthContextSpy.mockReturnValueOnce({ ...mockAuthContextReturnValue, isLoggedIn: true })

      renderOfferFooter({ offer: offerWithPublicationDate })

      await user.press(await screen.findByText('Ajouter un rappel'))

      expect(screen.getByText('Désactiver le rappel')).toBeOnTheScreen()
    })

    it('should display signinModal when user presses favorite button but is not logged in', async () => {
      renderOfferFooter({ offer: offerWithPublicationDate })

      await user.press(await screen.findByText('Mettre en favori'))

      expect(screen.getByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
    })

    it('should add offer to favorites when user is logged in and presses addTofavorite button', async () => {
      useAuthContextSpy.mockReturnValueOnce({
        isLoggedIn: true,
        isUserLoading: false,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
      })

      const { addFavorite } = renderOfferFooter({ offer: offerWithPublicationDate })

      await user.press(await screen.findByText('Mettre en favori'))

      expect(addFavorite).toHaveBeenCalledWith({ offerId: offerWithPublicationDate.id })
    })

    it('should remove offer from favorites when user is logged in and presses removeFromfavorite button', async () => {
      useAuthContextSpy.mockReturnValueOnce({
        isLoggedIn: true,
        isUserLoading: false,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
      })

      const { removeFavorite, favorite } = renderOfferFooter({
        offer: offerWithPublicationDate,
        favorite: { id: favoriteResponseSnap.id, offer: favoriteResponseSnap.offer },
      })

      await user.press(await screen.findByText('Retirer des favoris'))

      expect(removeFavorite).toHaveBeenCalledWith(favorite?.id)
    })

    it('should display loader when addToFavorite button is loading', async () => {
      renderOfferFooter({ offer: offerWithPublicationDate, isAddFavoriteLoading: true })

      expect(screen.queryByText('Mettre en favori')).not.toBeOnTheScreen()

      expect(screen.getByLabelText('Chargement en cours')).toBeOnTheScreen()
    })
  })

  describe('Content when offer is not a movie screening and does not have a publicationDate in the future', () => {
    const CURRENT_DATE = new Date('2025-04-01T14:15:00Z')

    const offerWithPublicationDate = {
      ...offerResponseSnap,
      isReleased: false,
      publicationDate: CURRENT_DATE.toString(),
    }

    beforeEach(() => {
      mockDate.set(CURRENT_DATE)
    })

    it('should display CTA received as props', async () => {
      renderOfferFooter({
        offer: offerWithPublicationDate,
        children: <Button title="Réserver l’offre" />,
      })

      expect(screen.getByText('Réserver l’offre')).toBeOnTheScreen()
    })
  })

  describe('Content when offer is not a movie screening, does not have a publicationDate in the future and viewport is desktop', () => {
    it('should return null', async () => {
      renderOfferFooter({
        children: <Button title="Réserver l’offre" />,
        isDesktopViewport: true,
      })

      expect(screen.queryByText("Réserver l'offre")).toBeNull()
    })
  })
})

type RenderOfferFooterType = Partial<OfferFooterProps> & {
  isDesktopViewport?: boolean
}

const renderOfferFooter = ({
  offer = offerResponseSnap,
  children,
  addFavorite = jest.fn(),
  isAddFavoriteLoading = false,
  removeFavorite = jest.fn(),
  isRemoveFavoriteLoading = false,
  favorite = null,
  isDesktopViewport,
}: RenderOfferFooterType) => {
  render(
    reactQueryProviderHOC(
      <OfferCTAProvider>
        <OfferFooter
          offer={offer}
          addFavorite={addFavorite}
          isAddFavoriteLoading={isAddFavoriteLoading}
          removeFavorite={removeFavorite}
          isRemoveFavoriteLoading={isRemoveFavoriteLoading}
          favorite={favorite}>
          {children}
        </OfferFooter>
      </OfferCTAProvider>
    ),
    {
      theme: { isDesktopViewport: isDesktopViewport ?? false },
    }
  )

  return { addFavorite, removeFavorite, favorite }
}
