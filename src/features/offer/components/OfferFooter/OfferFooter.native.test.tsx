import { addDays } from 'date-fns'
import mockDate from 'mockdate'
import React from 'react'
import { Button } from 'react-native'

import { api } from 'api/api'
import { GetRemindersResponse } from 'api/gen'
import { favoriteOfferResponseSnap } from 'features/favorites/fixtures/favoriteOfferResponseSnap'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import * as useOfferCTAContextModule from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferFooter, OfferFooterProps } from 'features/offer/components/OfferFooter/OfferFooter'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { reminder, remindersResponse } from 'features/offer/fixtures/remindersResponse'
import { beneficiaryUser } from 'fixtures/user'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

jest.mock('libs/jwt/jwt')

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

const useOfferCTASpy = jest.spyOn(useOfferCTAContextModule, 'useOfferCTA')

const addReminderMutationSpy = jest.spyOn(api, 'postNativeV1MeReminders')
const deleteReminderMutationSpy = jest.spyOn(api, 'deleteNativeV1MeRemindersreminderId')

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

jest.mock('features/auth/context/AuthContext')

const mockUseOfferCTAReturnValue = {
  wording: 'Cine content CTA',
  onPress: jest.fn(),
  setButton: jest.fn(),
  showButton: jest.fn(),
  isButtonVisible: false,
}

jest.useFakeTimers()
const user = userEvent.setup()

describe('OfferFooter', () => {
  beforeAll(() => {
    useRemoteConfigSpy.mockReturnValue(remoteConfigResponseFixture)
    useOfferCTASpy.mockReturnValue(mockUseOfferCTAReturnValue)
  })

  beforeEach(() => mockServer.getApi<GetRemindersResponse>('/v1/me/reminders', remindersResponse))

  describe('Content when offer is a movie screening', () => {
    beforeEach(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          showAccessScreeningButton: true,
        },
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
      publicationDate: addDays(CURRENT_DATE, 20).toString(),
    }

    beforeEach(() => {
      mockDate.set(CURRENT_DATE)
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          showAccessScreeningButton: false,
        },
      })
    })

    it('should display coming soon banner', async () => {
      renderOfferFooter({ offer: offerWithPublicationDate })

      expect(await screen.findByText('Cette offre sera bientôt disponible')).toBeOnTheScreen()
    })

    it('should display addToFavorites button when offer has not been added to favorites', async () => {
      renderOfferFooter({ offer: offerWithPublicationDate, favorite: null })
      await screen.findByText('Cette offre sera bientôt disponible')

      expect(await screen.findByText('Mettre en favori')).toBeOnTheScreen()
    })

    it('should display removeFromFavorites button when offer has been added to favorites', async () => {
      renderOfferFooter({
        offer: offerWithPublicationDate,
        favorite: { id: favoriteOfferResponseSnap.id, offer: favoriteOfferResponseSnap },
      })

      await screen.findByText('Cette offre sera bientôt disponible')

      expect(await screen.findByText('Retirer des favoris')).toBeOnTheScreen()
    })

    it('should display addReminder button', async () => {
      renderOfferFooter({ offer: offerWithPublicationDate })

      await screen.findByText('Cette offre sera bientôt disponible')

      expect(await screen.findByText('Ajouter un rappel')).toBeOnTheScreen()
    })

    it('should display disableReminder button', async () => {
      mockAuthContextWithUser(beneficiaryUser, { persist: true })

      renderOfferFooter({
        offer: {
          ...offerWithPublicationDate,

          id: reminder.offer.id,
        },
      })

      await screen.findByText('Cette offre sera bientôt disponible')

      expect(await screen.findByText('Désactiver le rappel')).toBeOnTheScreen()
    })

    it('should display signinModal when user presses favorite button but is not logged in', async () => {
      mockAuthContextWithoutUser({ persist: true })

      renderOfferFooter({ offer: offerWithPublicationDate })

      await screen.findByText('Cette offre sera bientôt disponible')

      await user.press(await screen.findByText('Mettre en favori'))

      expect(await screen.findByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
    })

    it('should add offer to favorites when user is logged in and presses addTofavorite button', async () => {
      mockAuthContextWithUser(beneficiaryUser, { persist: true })

      const { addFavorite } = renderOfferFooter({ offer: offerWithPublicationDate })

      await screen.findByText('Cette offre sera bientôt disponible')

      await user.press(await screen.findByText('Mettre en favori'))

      expect(addFavorite).toHaveBeenCalledWith({ offerId: offerWithPublicationDate.id })
    })

    it('should remove offer from favorites when user is logged in and presses removeFromfavorite button', async () => {
      mockAuthContextWithUser(beneficiaryUser, { persist: true })

      const { removeFavorite, favorite } = renderOfferFooter({
        offer: offerWithPublicationDate,
        favorite: { id: favoriteResponseSnap.id, offer: favoriteResponseSnap.offer },
      })

      await screen.findByText('Cette offre sera bientôt disponible')

      await user.press(await screen.findByText('Retirer des favoris'))

      expect(removeFavorite).toHaveBeenCalledWith(favorite?.id)
    })

    it('should display loader when addToFavorite button is loading', async () => {
      renderOfferFooter({ offer: offerWithPublicationDate, isAddFavoriteLoading: true })

      await screen.findByText('Cette offre sera bientôt disponible')

      expect(screen.queryByText('Mettre en favori')).not.toBeOnTheScreen()

      expect(await screen.findByLabelText('Chargement en cours')).toBeOnTheScreen()
    })

    it('should display snackbar when addReminder fails', async () => {
      mockAuthContextWithUser(beneficiaryUser, { persist: true })

      addReminderMutationSpy.mockRejectedValueOnce({ status: 400 })

      renderOfferFooter({
        offer: offerWithPublicationDate,
      })

      await screen.findByText('Cette offre sera bientôt disponible')

      await user.press(await screen.findByText('Ajouter un rappel'))

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'L’offre n’a pas pu être ajoutée à tes rappels',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should show reminder authentication modal when not logged in', async () => {
      mockAuthContextWithoutUser({ persist: true })

      mockServer.getApi<GetRemindersResponse>('/v1/me/reminders', {})
      renderOfferFooter({ offer: offerWithPublicationDate })

      await screen.findByText('Cette offre sera bientôt disponible')

      await user.press(await screen.findByText('Ajouter un rappel'))

      expect(screen.getByText('Identifie-toi pour activer un rappel')).toBeOnTheScreen()
    })

    it('should call addReminder when no existing reminder', async () => {
      mockAuthContextWithUser(beneficiaryUser, { persist: true })

      mockServer.getApi<GetRemindersResponse>('/v1/me/reminders', {})
      mockServer.postApi(`/v1/me/reminders`, {
        responseOptions: { statusCode: 201, data: {} },
      })

      renderOfferFooter({
        offer: offerWithPublicationDate,
      })

      await screen.findByText('Cette offre sera bientôt disponible')

      await user.press(await screen.findByText('Ajouter un rappel'))

      expect(addReminderMutationSpy).toHaveBeenCalledWith({ offerId: offerWithPublicationDate.id })
    })

    it('should call deleteReminder when existing reminder', async () => {
      mockAuthContextWithUser(beneficiaryUser, { persist: true })

      mockServer.deleteApi(`/v1/me/reminders/${reminder.id}`, {
        responseOptions: { statusCode: 201, data: {} },
      })

      renderOfferFooter({
        offer: { ...offerWithPublicationDate, id: reminder.offer.id },
      })

      await screen.findByText('Cette offre sera bientôt disponible')

      await user.press(await screen.findByText('Désactiver le rappel'))

      expect(deleteReminderMutationSpy).toHaveBeenCalledWith(reminder.id)
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

      expect(await screen.findByText('Réserver l’offre')).toBeOnTheScreen()
    })
  })

  describe('Content when offer is not a movie screening, does not have a publicationDate in the future and viewport is desktop', () => {
    it('should return null', async () => {
      renderOfferFooter({
        children: <Button title="Réserver l’offre" />,
        isDesktopViewport: true,
      })

      await act(async () => {})

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
