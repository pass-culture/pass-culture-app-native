import React from 'react'
import { Social } from 'react-native-share'
import { ThemeProvider } from 'styled-components/native'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum, ExpenseDomain, ReactionTypeEnum } from 'api/gen'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { ConsentState } from 'features/cookies/enums'
import * as Cookies from 'features/cookies/helpers/useCookies'
import { ConsentStatus } from 'features/cookies/types'
import * as useFavorite from 'features/favorites/hooks/useFavorite'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useGetRemindersQuery from 'features/offer/queries/useGetRemindersQuery'
import { useOfferPageViewModel } from 'features/offerRefacto/pages/useOfferPageViewModel'
import { beneficiaryUser } from 'fixtures/user'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import * as PriceUtils from 'libs/parsers/getDisplayedPrice'
import { computedTheme } from 'tests/computedTheme'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const mockSaveReaction = jest.fn()
const mockShowModal = jest.fn()
const mockHideModal = jest.fn()

jest.mock('features/reactions/queries/useReactionMutation', () => ({
  useReactionMutation: () => ({
    mutate: mockSaveReaction,
  }),
}))
jest.mock('libs/firebase/analytics/analytics')
useRoute.mockReturnValue({ params: { id: offerResponseSnap.id } })

jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: mockHideModal,
  }),
}))

const mockUseOfferQuery = jest.fn()
jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => mockUseOfferQuery(),
}))

jest.mock('libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog', () => ({
  triggerConsultOfferLog: jest.fn(),
}))

const mockShareOffer = jest.fn()
jest.mock('features/share/helpers/getShareOffer', () => ({
  getShareOffer: () => ({
    share: mockShareOffer,
    shareContent: { title: 'Check this out!' },
  }),
}))

const mockShowErrorSnackBar = jest.fn()
const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
    showInfoSnackBar: mockShowInfoSnackBar,
  }),
}))

const consentState: ConsentStatus = { state: ConsentState.LOADING }
const consentValue = {
  mandatory: COOKIES_BY_CATEGORY.essential,
  accepted: ALL_OPTIONAL_COOKIES,
  refused: [],
}

const defaultUseCookies = {
  cookiesConsent: consentState,
  setCookiesConsent: jest.fn(),
  setUserId: jest.fn(),
  loadCookiesConsent: jest.fn(),
}
const mockUseCookies = jest.spyOn(Cookies, 'useCookies').mockReturnValue(defaultUseCookies)

const mockAddFavorite = jest.fn()
const mockRemoveFavorite = jest.fn()
jest.mock('queries/favorites/useAddFavoriteMutation', () => ({
  useAddFavoriteMutation: () => ({ mutate: mockAddFavorite, isPending: false }),
}))
jest.mock('queries/favorites/useRemoveFavoriteMutation', () => ({
  useRemoveFavoriteMutation: () => ({ mutate: mockRemoveFavorite, isPending: false }),
}))

const mockUseAuthContext = jest.fn().mockReturnValue({ user: undefined, isLoggedIn: false })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const useFavoriteSpy = jest.spyOn(useFavorite, 'useFavorite')

const mockAddReminder = jest.fn()
const mockDeleteReminder = jest.fn()
jest.mock('features/offer/queries/useAddReminderMutation', () => ({
  useAddReminderMutation: () => ({ mutate: mockAddReminder }),
}))
jest.mock('features/offer/queries/useDeleteReminderMutation', () => ({
  useDeleteReminderMutation: () => ({ mutate: mockDeleteReminder }),
}))

const mockRemindersData = {
  reminders: [{ id: 1000, offer: { id: offerResponseSnap.id } }],
}
const useGetRemindersQuerySpy = jest.spyOn(useGetRemindersQuery, 'useGetRemindersQuery')

const getDisplayedPriceSpy = jest.spyOn(PriceUtils, 'getDisplayedPrice')

describe('useOfferPageViewModel', () => {
  beforeEach(() => {
    mockUseOfferQuery.mockReturnValue({
      data: offerResponseSnap,
      isLoading: false,
    })
  })

  describe('submitReaction', () => {
    it('should call saveReaction and hide the modal when submitting a reaction', () => {
      const { result } = renderUseOfferPageViewModel()

      const payload = {
        offerId: offerResponseSnap.id,
        reactionType: ReactionTypeEnum.LIKE,
      }

      result.current.submitReaction(payload)

      expect(mockSaveReaction).toHaveBeenCalledWith({
        reactions: [{ offerId: offerResponseSnap.id, reactionType: 'LIKE' }],
      })
      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('showRecommendations', () => {
    it('should log, hide modal and navigate when showing recommendations', async () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.showRecommendations()

      expect(analytics.logClickAllClubRecos).toHaveBeenCalledWith({
        offerId: offerResponseSnap.id.toString(),
        from: 'offer',
        categoryName: CategoryIdEnum.CINEMA,
      })
      expect(mockHideModal).toHaveBeenCalledTimes(1)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('ThematicHome', {
          homeId: '4mlVpAZySUZO6eHazWKZeV',
          from: 'chronicles',
        })
      })
    })
  })

  describe('openPreview', () => {
    it('should navigate to OfferPreview when images exist', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.openPreview()

      expect(navigate).toHaveBeenCalledWith('OfferPreview', {
        id: offerResponseSnap.id,
        defaultIndex: 0,
      })
    })

    it('should NOT navigate if offer has not images', () => {
      mockUseOfferQuery.mockReturnValueOnce({
        data: { ...offerResponseSnap, images: null },
        isLoading: false,
      })
      const { result } = renderUseOfferPageViewModel()

      result.current.openPreview()

      expect(navigate).not.toHaveBeenCalled()
    })
  })

  describe('selectNewVenueOffer', () => {
    const NEXT_OFFER_ID = 999

    it('should log, hide modal and navigate when selecting new venue offer', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.selectNewVenueOffer(NEXT_OFFER_ID)

      expect(mockHideModal).toHaveBeenCalledTimes(1)
      expect(triggerConsultOfferLog).toHaveBeenCalledWith({
        offerId: NEXT_OFFER_ID,
        from: 'offer',
        fromMultivenueOfferId: offerResponseSnap.id,
      })
      expect(navigate).toHaveBeenCalledWith('Offer', {
        id: NEXT_OFFER_ID,
        fromOfferId: offerResponseSnap.id,
        fromMultivenueOfferId: offerResponseSnap.id,
      })
    })
  })

  describe('openChronicle', () => {
    const CHRONICLE_ID = 456

    it('should navigate to Chronicles page and log analytics with correct parameters', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.openChronicle(CHRONICLE_ID)

      expect(navigate).toHaveBeenCalledWith('Chronicles', {
        offerId: offerResponseSnap.id,
        chronicleId: CHRONICLE_ID,
        from: 'chronicles',
      })
      expect(analytics.logConsultChronicle).toHaveBeenCalledWith({
        offerId: offerResponseSnap.id,
        chronicleId: CHRONICLE_ID,
      })
    })
  })

  describe('logSeeAllChronicles', () => {
    it('should log analytics with correct parameters', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.logSeeAllChronicles()

      expect(analytics.logClickInfoReview).toHaveBeenCalledWith({
        from: 'offer',
        offerId: offerResponseSnap.id.toString(),
        categoryName: CategoryIdEnum.CINEMA,
      })
    })
  })

  describe('pressShareOffer', () => {
    it('should log analytics, trigger share and show modal', async () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.pressShareOffer()

      expect(analytics.logShare).toHaveBeenCalledWith({
        type: 'Offer',
        from: 'offer',
        offerId: offerResponseSnap.id,
      })
      expect(mockShareOffer).toHaveBeenCalledTimes(1)
      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('openVideoPlayer', () => {
    it('should display info snack bar when opening video player and cookies not consented', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.openVideoPlayer()

      expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
        message: 'Pour lire la vidéo, tu dois accepter les cookies vidéo...',
      })
    })

    it('should navigate to video player when cookies are consented', () => {
      mockUseCookies.mockReturnValueOnce({
        ...defaultUseCookies,
        cookiesConsent: {
          state: ConsentState.HAS_CONSENT,
          value: consentValue,
        },
      })
      const { result } = renderUseOfferPageViewModel()

      result.current.openVideoPlayer()

      expect(navigate).toHaveBeenCalledWith('OfferVideoPreview', {
        id: offerResponseSnap.id,
      })
    })
  })

  describe('toggleFavorite', () => {
    it('should show auth modal if user is NOT logged in', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.toggleFavorite()

      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })

    it('should add to favorite if logged in and NOT already a favorite', () => {
      mockUseAuthContext.mockReturnValueOnce({ user: beneficiaryUser, isLoggedIn: true })

      const { result } = renderUseOfferPageViewModel()

      result.current.toggleFavorite()

      expect(mockAddFavorite).toHaveBeenCalledWith({ offerId: offerResponseSnap.id })
    })

    it('should remove to favorite if logged in and already a favorite', () => {
      mockUseAuthContext.mockReturnValueOnce({ user: beneficiaryUser, isLoggedIn: true })
      useFavoriteSpy.mockReturnValueOnce({
        id: 1000,
        offer: {
          id: offerResponseSnap.id,
          coordinates: offerResponseSnap.venue.coordinates,
          expenseDomains: [ExpenseDomain.all],
          isReleased: true,
          name: offerResponseSnap.name,
          subcategoryId: offerResponseSnap.subcategoryId,
          venueName: offerResponseSnap.venue.name,
        },
      })

      const { result } = renderUseOfferPageViewModel()

      result.current.toggleFavorite()

      expect(mockRemoveFavorite).toHaveBeenCalledWith(1000)
    })
  })

  describe('toggleReminder', () => {
    it('should show auth modal if user is NOT logged in', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.toggleReminder()

      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })

    it('should add to reminder when logged in and NO reminder exists', () => {
      mockUseAuthContext.mockReturnValueOnce({ user: beneficiaryUser, isLoggedIn: true })

      const { result } = renderUseOfferPageViewModel()

      result.current.toggleReminder()

      expect(mockAddReminder).toHaveBeenCalledWith(offerResponseSnap.id)
    })

    it('should delete to reminder when logged in and a reminder ALREADY exists', () => {
      mockUseAuthContext.mockReturnValueOnce({ user: beneficiaryUser, isLoggedIn: true })
      // as never used to simplify the mock
      useGetRemindersQuerySpy.mockImplementationOnce((select) => {
        return {
          data: select ? select(mockRemindersData) : [],
          isLoading: false,
        } as never
      })

      const { result } = renderUseOfferPageViewModel()

      result.current.toggleReminder()

      expect(mockDeleteReminder).toHaveBeenCalledWith(1000)
    })
  })

  describe('logSocialShare', () => {
    it('should log social share with correct parameters', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.logSocialShare(Social.Facebook)

      expect(analytics.logShare).toHaveBeenCalledWith({
        type: 'Offer',
        from: 'offer',
        offerId: offerResponseSnap.id,
        platform: Social.Facebook,
      })
    })
  })

  describe('logConsultVideo', () => {
    it('should log consult video with correct parameters', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.logConsultVideo()

      expect(analytics.logConsultVideo).toHaveBeenCalledWith({
        from: 'offer',
        offerId: offerResponseSnap.id.toString(),
      })
    })
  })

  describe('logConsultItinerary', () => {
    it('should log consult itinerary with correct parameters', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.logConsultItinerary()

      expect(analytics.logConsultItinerary).toHaveBeenCalledWith({
        from: 'offer',
        offerId: offerResponseSnap.id,
      })
    })
  })

  describe('getDisplayedOfferPrice', () => {
    it('should call getDisplayedPrice', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.getDisplayedOfferPrice({
        offer: offerResponseSnap,
        objectID: '1',
        _geoloc: { lat: 0, lng: 0 },
        venue: { id: offerResponseSnap.venue.id, name: offerResponseSnap.venue.name },
      })

      expect(getDisplayedPriceSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('openArtistPage', () => {
    it('should navigate directly and log analytics if there is exactly ONE artist', () => {
      const artist = { id: '1', name: 'Picasso' }
      mockUseOfferQuery.mockReturnValueOnce({
        data: { ...offerResponseSnap, artists: [artist] },
        isLoading: false,
      })

      const { result } = renderUseOfferPageViewModel()

      result.current.openArtistPage()

      expect(analytics.logConsultArtist).toHaveBeenCalledWith({
        offerId: offerResponseSnap.id.toString(),
        artistId: '1',
        artistName: 'Picasso',
        from: 'offer',
      })
      expect(navigate).toHaveBeenCalledWith('Artist', { id: '1' })
    })

    it('should show the artists modal if there are MULTIPLE artists', () => {
      const artists = [
        { id: 1, name: 'Picasso' },
        { id: 2, name: 'Dali' },
      ]
      mockUseOfferQuery.mockReturnValueOnce({
        data: { ...offerResponseSnap, artists },
        isLoading: false,
      })

      const { result } = renderUseOfferPageViewModel()

      result.current.openArtistPage()

      expect(mockShowModal).toHaveBeenCalledTimes(1)
      expect(navigate).not.toHaveBeenCalled()
    })
  })

  describe('openCookiesSettings', () => {
    it('should navigate to consent settings page', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.openCookiesSettings()

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        screen: 'ConsentSettings',
        params: { offerId: offerResponseSnap.id },
      })
    })
  })

  describe('openVenuePage', () => {
    it('should log analytics and navigate if venue is permanent', () => {
      const { result } = renderUseOfferPageViewModel()

      result.current.openVenuePage()

      expect(analytics.logConsultVenue).toHaveBeenCalledWith({
        venueId: offerResponseSnap.venue.id.toString(),
        from: 'offer',
      })
      expect(navigate).toHaveBeenCalledWith('Venue', { id: offerResponseSnap.venue.id })
    })
  })

  describe('openChangeVenueModal', () => {
    it('should show the change venue modal and trigger logMultivenueOptionDisplayed', async () => {
      const { result } = renderUseOfferPageViewModel()

      await result.current.openChangeVenueModal()

      expect(mockShowModal).toHaveBeenCalledTimes(1)
      expect(analytics.logMultivenueOptionDisplayed).toHaveBeenCalledWith(offerResponseSnap.id)
    })
  })
})

const renderUseOfferPageViewModel = () => {
  return renderHook(() => useOfferPageViewModel(), {
    wrapper: ({ children }) => (
      <ThemeProvider theme={computedTheme}>{reactQueryProviderHOC(children)}</ThemeProvider>
    ),
  })
}
