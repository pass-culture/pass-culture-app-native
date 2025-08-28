import { SearchResponse } from '@algolia/client-search'
import AsyncStorage from '@react-native-async-storage/async-storage'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OffersStocksResponseV2, SubcategoryIdEnum, VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { useGTLPlaylistsQuery } from 'features/gtlPlaylist/queries/useGTLPlaylistsQuery'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { CineContentCTAID } from 'features/offer/components/OfferCine/CineContentCTA'
import * as useOfferCTAContextModule from 'features/offer/components/OfferContent/OfferCTAProvider'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import {
  VenueMoviesOffersResponseSnap,
  VenueOffersResponseSnap,
} from 'features/venue/fixtures/venueOffersResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { Network } from 'libs/share/types'
import { useVenueOffersQuery } from 'queries/venue/useVenueOffersQuery'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'
import * as AnchorContextModule from 'ui/components/anchor/AnchorContext'

const getItemSpy = jest.spyOn(AsyncStorage, 'getItem')

jest.useFakeTimers()

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')
jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/itinerary/useItinerary')
jest.mock('queries/venue/useVenueOffersQuery')
const mockUseVenueOffers = useVenueOffersQuery as jest.Mock

jest.mock('features/search/context/SearchWrapper')
jest.mock('libs/location')

jest.mock('libs/subcategories/useSubcategories')
const venueId = venueDataTest.id
jest.mock('features/gtlPlaylist/queries/useGTLPlaylistsQuery')
const mockUseGTLPlaylists = useGTLPlaylistsQuery as jest.Mock
mockUseGTLPlaylists.mockReturnValue({
  gtlPlaylists: [
    {
      title: 'Test',
      offers: {
        hits: [
          {
            offer: {
              name: 'Test',
              subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
            },
            venue: {
              address: 'Avenue des Tests',
              city: 'Jest',
            },
            _geoloc: {
              lat: 2,
              lng: 2,
            },
            objectID: '12',
          },
        ],
      } as SearchResponse<Offer>,
      layout: 'one-item-medium',
      entryId: '2xUlLBRfxdk6jeYyJszunX',
      minNumberOfOffers: 1,
    },
  ],
  isLoading: false,
})

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
const useScrollToAnchorSpy = jest.spyOn(AnchorContextModule, 'useScrollToAnchor')

const user = userEvent.setup()

describe('<Venue />', () => {
  beforeAll(() => {
    mockUseVenueOffers.mockReturnValue({
      isLoading: false,
      data: { hits: VenueOffersResponseSnap, nbHits: 3, headlineOffer: VenueOffersResponseSnap[0] },
    })
  })

  beforeEach(() => {
    setFeatureFlags()
    getItemSpy.mockReset()
    mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', {})
    mockServer.getApi<VenueResponse>(`/v1/venue/${venueId}`, {
      ...venueDataTest,
      isOpenToPublic: true,
    })
  })

  it('should match snapshot', async () => {
    renderVenue(venueId)

    await screen.findByText(`Envoyer sur ${Network.instagram}`)

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot with practical information', async () => {
    renderVenue(venueId)

    await user.press(await screen.findByText('Infos pratiques'))

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot with headline offer', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_HEADLINE_OFFER])
    renderVenue(venueId)

    await screen.findByText('À la une')

    expect(screen).toMatchSnapshot()
  })

  it('should display default background image when no banner for venue', async () => {
    renderVenue(venueId)

    expect(await screen.findByTestId('defaultVenueBackground')).toBeOnTheScreen()
  })

  describe('CTA', () => {
    it('should not display CTA if venueTypeCode is Movie', async () => {
      const mockedVenue = { ...venueDataTest, venueTypeCode: VenueTypeCodeKey.MOVIE }

      mockServer.getApi<VenueResponse>(`/v1/venue/${venueId}`, mockedVenue)

      renderVenue(venueId)

      await screen.findAllByText('Le Petit Rintintin 1')

      expect(screen.queryByText('Rechercher une offre')).not.toBeOnTheScreen()
    })

    it('should display CTA if venueTypeCode is not Movie and venueOffers hits have length', async () => {
      mockUseGTLPlaylists.mockReturnValueOnce({
        isLoading: false,
        gtlPlaylists: [],
      })

      renderVenue(venueId)

      await screen.findAllByText('Le Petit Rintintin 1')

      expect(await screen.findByText('Rechercher une offre')).toBeOnTheScreen()
    })

    it('should display CTA if venueTypeCode is not Movie and gtlPlaylists have length', async () => {
      mockUseVenueOffers.mockReturnValueOnce({
        isLoading: false,
        data: { hits: [], nbHits: 0 },
      })

      renderVenue(venueId)

      await screen.findAllByText('Le Petit Rintintin 1')

      expect(await screen.findByText('Rechercher une offre')).toBeOnTheScreen()
    })
  })

  describe('analytics', () => {
    it.each([['deeplink'], ['venueMap']])(
      'should log consult venue when URL from param equal to %s',
      async (from) => {
        renderVenue(venueId, from as Referrals)

        await waitFor(() => {
          expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
            venueId: venueId.toString(),
            from,
          })
        })
      }
    )

    it('should not log consult venue when URL has unexpected "from" param', async () => {
      renderVenue(venueId, 'unexpected_from_param' as Referrals)

      await screen.findByText('Infos pratiques')

      expect(analytics.logConsultVenue).not.toHaveBeenCalled()
    })

    it('should not log consult venue when URL has not "from" param', async () => {
      renderVenue(venueId)

      await screen.findByText('Infos pratiques')

      expect(analytics.logConsultVenue).not.toHaveBeenCalled()
    })
  })

  describe('movie screening access button', () => {
    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          showAccessScreeningButton: true,
        },
      })

      mockUseVenueOffers.mockReturnValue({
        isLoading: false,
        data: { hits: VenueMoviesOffersResponseSnap, nbHits: 4 },
      })
    })

    beforeEach(() => {
      // Mock API Calls
      const mockedVenue = { ...venueDataTest, venueTypeCode: VenueTypeCodeKey.MOVIE }
      mockServer.getApi<VenueResponse>(`/v1/venue/${venueId}`, mockedVenue)
      mockServer.postApi<OffersStocksResponseV2>(`/v2/offers/stocks`, {})
    })

    it('should show button by default', async () => {
      renderVenue(venueId)

      await screen.findByText('Les films à l’affiche')

      expect(await screen.findByTestId(CineContentCTAID)).toBeOnTheScreen()
    })

    it('should not show button when in View', async () => {
      const useOfferCTASpy = jest.spyOn(useOfferCTAContextModule, 'useOfferCTA')

      const mockUseOfferReturnValue = {
        wording: '',
        onPress: jest.fn(),
        setButton: jest.fn(),
        showButton: jest.fn(),
        isButtonVisible: true,
      }
      useOfferCTASpy
        .mockReturnValueOnce({
          ...mockUseOfferReturnValue,
          isButtonVisible: false,
        })
        .mockReturnValueOnce({
          ...mockUseOfferReturnValue,
          isButtonVisible: false,
        })

      renderVenue(venueId)

      await screen.findByText('Les films à l’affiche')

      expect(screen.queryByTestId(CineContentCTAID)).not.toBeOnTheScreen()
    })

    it('should scroll to anchor', async () => {
      renderVenue(venueId)

      const button = await screen.findByTestId(CineContentCTAID)

      await userEvent.press(button)

      expect(useScrollToAnchorSpy).toHaveBeenCalledWith()
    })

    describe('remote config flag is deactivated', () => {
      beforeAll(() => {
        useRemoteConfigSpy.mockReturnValue({
          ...remoteConfigResponseFixture,
          data: {
            ...DEFAULT_REMOTE_CONFIG,
            showAccessScreeningButton: false,
          },
        })
      })

      it('should not display the button if the remote config flag is deactivated', async () => {
        renderVenue(venueId)

        await screen.findByText('Les films à l’affiche')

        expect(screen.queryByTestId(CineContentCTAID)).not.toBeOnTheScreen()
      })
    })
  })
})

async function renderVenue(id: number, from?: Referrals) {
  useRoute.mockImplementation(() => ({ params: { id, from } }))
  render(reactQueryProviderHOC(<Venue />))
}
