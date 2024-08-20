import mockdate from 'mockdate'
import React from 'react'

import {
  BookingsResponse,
  OfferResponseV2,
  OfferStockResponse,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
  SubscriptionStatus,
  UserProfileResponse,
  YoungStatusType,
} from 'api/gen'
import { IAuthContext } from 'features/auth/context/AuthContext'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { mockOffer as mockBaseOffer } from 'features/bookOffer/fixtures/offer'
import { MovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/MovieScreeningCalendar'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Subcategory } from 'libs/subcategories/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/jwt/jwt')
jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

mockdate.set(new Date('2024-01-01T00:00:00.000Z'))

const defaultAuthContext: IAuthContext = {
  isLoggedIn: false,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
}

const defaultLoggedInUser: UserProfileResponse | IAuthContext = {
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  isUserLoading: false,
  refetchUser: jest.fn(),
  user: {
    ...beneficiaryUser,
    depositExpirationDate: String(new Date()),
  },
}

let mockAuthContext = defaultAuthContext

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => mockAuthContext),
}))

const mockOffer = mockBaseOffer
jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

const defaultOfferStockResponse: OfferStockResponse = {
  beginningDatetime: '2024-02-27T11:10:00Z',
  features: ['VO'],
  id: 6091,
  isBookable: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  price: 570,
}

const defaultOfferResponse: OfferResponseV2 = {
  ...offerResponseSnap,
  subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
  stocks: [defaultOfferStockResponse],
}

jest.mock('libs/firebase/analytics/analytics')

describe('Movie screening calendar', () => {
  it('should render <MovieScreeningCalendar /> with screening ordered by hours', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          defaultOfferStockResponse,
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T13:20:00Z' },
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T10:20:00Z' },
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T12:20:00Z' },
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T12:00:00Z' },
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T00:10:00Z' },
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T00:00:00Z' },
        ],
      },
      isDesktopViewport: true,
    })

    await screen.findByLabelText('Mardi 27 Février')

    expect(screen).toMatchSnapshot()
  })

  it('should not show eventCard if there is no beginningDateTime for screening', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          {
            ...defaultOfferStockResponse,
            beginningDatetime: '2024-02-27T19:20:00Z',
            price: 192,
          },
          { ...defaultOfferStockResponse, beginningDatetime: undefined, price: 177 },
        ],
      },
    })

    await screen.findByText('1,92 €')

    expect(screen.queryByText('1,77 €')).not.toBeOnTheScreen()
  })

  it('should render <MovieScreeningCalendar /> without duplicated screening dates', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          defaultOfferStockResponse,
          { ...defaultOfferStockResponse, beginningDatetime: '2024-02-27T11:20:00Z' },
        ],
      },
    })

    expect(await screen.findByLabelText('Mardi 27 Février')).toBeOnTheScreen()
  })

  it('should render <MovieScreeningCalendar /> without expired screenings', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          defaultOfferStockResponse,
          {
            ...defaultOfferStockResponse,
            beginningDatetime: '2024-02-29T13:30:00Z',
            isExpired: true,
          },
        ],
      },
    })

    await screen.findByLabelText('Mardi 27 Février')

    expect(screen.queryByLabelText('Jeudi 29 février')).not.toBeOnTheScreen()
  })

  it('should render <MovieScreeningCalendar /> without forbidden to underage screenings', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          defaultOfferStockResponse,
          {
            ...defaultOfferStockResponse,
            beginningDatetime: '2024-02-19T11:10:00Z',
            isForbiddenToUnderage: true,
          },
        ],
      },
    })

    await screen.findByLabelText('Mardi 27 Février')

    expect(screen.queryByLabelText('Lundi 19 février')).not.toBeOnTheScreen()
  })

  it('should render "Complet" when screening is sold out', async () => {
    renderMovieScreeningCalendar({
      offer: {
        ...defaultOfferResponse,
        stocks: [
          {
            ...defaultOfferStockResponse,
            isSoldOut: true,
          },
        ],
      },
    })

    await screen.findByLabelText('Mardi 27 Février')

    expect(screen.getByLabelText('Complet')).toBeOnTheScreen()
  })

  describe('Authentication dependant', () => {
    beforeEach(() => {
      mockServer.getApi<BookingsResponse>('/v1/bookings', bookingsSnap)
      mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
      mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
      mockAuthContext = defaultAuthContext
    })

    it('should open authentication modal when an event card is pressed and user is not logged in', async () => {
      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      const bookingOfferButton = await screen.findByLabelText('VO')
      await act(async () => {
        fireEvent.press(bookingOfferButton)
      })

      expect(screen.getByText('Identifie-toi pour réserver l’offre')).toBeOnTheScreen()
    })

    it('should open isDuo modal when user is loggedIn and clicks on a bookable eventCard', async () => {
      mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)

      mockAuthContext = defaultLoggedInUser

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      const eventCard = await screen.findByLabelText('VO')
      await act(async () => {
        fireEvent.press(eventCard)
      })

      await screen.findByText('Choix des options')

      expect(await screen.findByText('Nombre de places')).toBeOnTheScreen()
    })

    it('should open finishSubscription modal when user has to complete subscription', async () => {
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...nonBeneficiaryUser,
          status: {
            statusType: YoungStatusType.eligible,
            subscriptionStatus: SubscriptionStatus.has_to_complete_subscription,
          },
        },
      }

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      const eventCard = await screen.findByLabelText('VO')
      await act(async () => {
        fireEvent.press(eventCard)
      })

      expect(
        await screen.findByText('Débloque ton crédit pour réserver cette offre')
      ).toBeOnTheScreen()
    })

    it('should open applicationProcessing modal when user is waiting for his application to complete', async () => {
      mockServer.getApi('/v1/me/favorites', {
        page: 1,
        nbFavorites: 0,
        favorites: [],
      })

      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...nonBeneficiaryUser,
          status: {
            statusType: YoungStatusType.eligible,
            subscriptionStatus: SubscriptionStatus.has_subscription_pending,
          },
        },
      }

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      const eventCard = await screen.findByLabelText('VO')
      await act(async () => {
        fireEvent.press(eventCard)
      })

      expect(await screen.findByText('C’est pour bientôt !')).toBeOnTheScreen()
    })

    it('should open errorApplication modal when user has an issue with his application', async () => {
      mockServer.getApi('/v1/me/favorites', {
        page: 1,
        nbFavorites: 0,
        favorites: [],
      })
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...nonBeneficiaryUser,
          status: {
            statusType: YoungStatusType.eligible,
            subscriptionStatus: SubscriptionStatus.has_subscription_issues,
          },
        },
      }

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      const eventCard = await screen.findByLabelText('VO')
      await act(async () => {
        fireEvent.press(eventCard)
      })

      expect(await screen.findByText('Tu n’as pas encore obtenu ton crédit')).toBeOnTheScreen()
    })

    it('should display "Déjà réservé" if user has already booked offer in venue', async () => {
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...beneficiaryUser,
          depositExpirationDate: String(new Date()),
          bookedOffers: { '213': 123 },
        },
      }

      renderMovieScreeningCalendar({
        offer: {
          ...defaultOfferResponse,
          id: 213,
          stocks: [
            {
              ...defaultOfferStockResponse,
              beginningDatetime: bookingsSnap?.ongoing_bookings?.[0]?.stock.beginningDatetime,
            },
          ],
        },
      })

      await screen.findByLabelText('Lundi 15 Mars')

      expect(await screen.findByText('Déjà réservé')).toBeOnTheScreen()
    })

    it('should show "Crédit insuffisant" when user is logged in and does not have enough credit', async () => {
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...beneficiaryUser,
          domainsCredit: {
            all: { initial: 0, remaining: 0 },
            physical: { initial: 0, remaining: 0 },
            digital: { initial: 0, remaining: 0 },
          },
        },
      }

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      await screen.findByLabelText('Mardi 27 Février')

      expect(await screen.findByText('Crédit insuffisant')).toBeOnTheScreen()
    })

    it('should show "Indisponible" when provider is down and the offer cannot be booked', async () => {
      renderMovieScreeningCalendar({
        offer: { ...defaultOfferResponse, isExternalBookingsDisabled: true },
      })

      await screen.findByLabelText('Mardi 27 Février')

      expect(await screen.findByText('Indisponible')).toBeOnTheScreen()
    })

    it('should show "Crédit insuffisant" instead of "Complet" when user does not have enough credit and screening is sold out', async () => {
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...beneficiaryUser,
          domainsCredit: {
            all: { initial: 0, remaining: 0 },
            physical: { initial: 0, remaining: 0 },
            digital: { initial: 0, remaining: 0 },
          },
        },
      }

      renderMovieScreeningCalendar({
        offer: {
          ...defaultOfferResponse,
          stocks: [
            {
              ...defaultOfferStockResponse,
              isSoldOut: true,
            },
          ],
        },
      })

      await screen.findByLabelText('Mardi 27 Février')

      expect(await screen.findByText('Crédit insuffisant')).toBeOnTheScreen()
    })

    it('should show disabled eventCard when user has expired credit', async () => {
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...nonBeneficiaryUser,
          depositExpirationDate: '2021-11-01T00:00:00.000Z',
        },
      }

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      await screen.findByLabelText('Mardi 27 Février')

      expect(screen.getByTestId('event-card')).toBeDisabled()
    })

    it('should show features informations, separated with coma, on eventCard when user has expired credit', async () => {
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...nonBeneficiaryUser,
          depositExpirationDate: '2021-11-01T00:00:00.000Z',
        },
      }

      renderMovieScreeningCalendar({
        offer: {
          ...defaultOfferResponse,
          stocks: [
            {
              ...defaultOfferStockResponse,
              features: ['VO', '3D'],
            },
          ],
        },
      })

      await screen.findByLabelText('Mardi 27 Février')

      expect(screen.getByTestId('event-card')).toHaveTextContent('VO, 3D')
    })

    it('should show disabled eventCard when user is not eligible', async () => {
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...nonBeneficiaryUser,
        },
      }

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      await screen.findByLabelText('Mardi 27 Février')

      expect(screen.getByTestId('event-card')).toBeDisabled()
    })

    it('should show features informations, separated with coma, on eventCard when user is not eligible', async () => {
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...nonBeneficiaryUser,
        },
      }

      renderMovieScreeningCalendar({
        offer: {
          ...defaultOfferResponse,
          stocks: [
            {
              ...defaultOfferStockResponse,
              features: ['VO', '3D'],
            },
          ],
        },
      })

      await screen.findByLabelText('Mardi 27 Février')

      expect(screen.getByTestId('event-card')).toHaveTextContent('VO, 3D')
    })

    it('should log event ClickBookOffer when user is logged in and a cliquable eventcard is pressed', async () => {
      mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)

      mockAuthContext = defaultLoggedInUser

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      await screen.findByLabelText('Mardi 27 Février')

      const eventCard = await screen.findByLabelText('VO')
      await act(async () => {
        fireEvent.press(eventCard)
      })

      expect(analytics.logClickBookOffer).toHaveBeenCalledWith({ offerId: offerResponseSnap.id })
    })

    it('should not log event ClickBookOffer when user clicks on a disabled eventcard', async () => {
      mockAuthContext = {
        ...defaultLoggedInUser,
        user: {
          ...beneficiaryUser,
          domainsCredit: {
            all: { initial: 0, remaining: 0 },
            physical: { initial: 0, remaining: 0 },
            digital: { initial: 0, remaining: 0 },
          },
        },
      }

      renderMovieScreeningCalendar({ offer: defaultOfferResponse })

      await screen.findByLabelText('Mardi 27 Février')

      const eventCard = await screen.findByLabelText('Crédit insuffisant')
      await act(async () => {
        fireEvent.press(eventCard)
      })

      await screen.findByLabelText('Mardi 27 Février')

      expect(analytics.logClickBookOffer).not.toHaveBeenCalled()
    })
  })
})

const renderMovieScreeningCalendar = ({
  offer = offerResponseSnap,
  subcategory = mockSubcategory,
  isDesktopViewport = false,
}: {
  offer: OfferResponseV2
  subcategory?: Subcategory
  isDesktopViewport?: boolean
}) => {
  render(
    reactQueryProviderHOC(<MovieScreeningCalendar offer={offer} subcategory={subcategory} />),
    { theme: { isDesktopViewport: isDesktopViewport } }
  )
}
