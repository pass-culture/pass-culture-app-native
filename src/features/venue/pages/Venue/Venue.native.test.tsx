import { SearchResponse } from '@algolia/client-search'
import AsyncStorage from '@react-native-async-storage/async-storage'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const getItemSpy = jest.spyOn(AsyncStorage, 'getItem')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}

jest.useFakeTimers()

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')
jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/itinerary/useItinerary')
jest.mock('features/venue/api/useVenueOffers')
jest.mock('features/search/context/SearchWrapper')
jest.mock('libs/location')

jest.mock('libs/subcategories/useSubcategories')
const venueId = venueDataTest.id

jest.mock('features/gtlPlaylist/hooks/useGTLPlaylists')
const mockUseGTLPlaylists = useGTLPlaylists as jest.Mock
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

jest.mock('@shopify/flash-list', () => {
  const ActualFlashList = jest.requireActual('@shopify/flash-list').FlashList
  class MockFlashList extends ActualFlashList {
    componentDidMount() {
      super.componentDidMount()
      this.rlvRef?._scrollComponent?._scrollViewRef?.props?.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('<Venue />', () => {
  beforeEach(() => {
    activateFeatureFlags()
    mockServer.getApi<VenueResponse>(`/v1/venue/${venueId}`, venueDataTest)
  })

  it('should match snapshot', async () => {
    renderVenue(venueId)

    await screen.findByText('Infos pratiques')

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot with practical information', async () => {
    renderVenue(venueId)

    fireEvent.press(await screen.findByText('Infos pratiques'))

    expect(screen).toMatchSnapshot()
  })

  it('should display video section with FF on', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_FAKEDOOR_VIDEO_VENUE])
    renderVenue(venueId)

    expect(await screen.findByText('Vidéo de ce lieu')).toBeOnTheScreen()
  })

  it('should not display video player if video has already been seen', async () => {
    getItemSpy.mockResolvedValueOnce('true')
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_FAKEDOOR_VIDEO_VENUE])
    renderVenue(venueId)

    await waitFor(() => expect(screen.queryByText('Vidéo de ce lieu')).not.toBeOnTheScreen())
  })

  it('should hide video block once survey modal is closed', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_FAKEDOOR_VIDEO_VENUE])
    renderVenue(venueId)

    fireEvent.press(await screen.findByLabelText('Faux lecteur vidéo'))
    fireEvent.press(await screen.findByLabelText('Fermer la modale'))

    await waitFor(() => expect(screen.queryByText('Vidéo de ce lieu')).not.toBeOnTheScreen())
  })

  describe('analytics', () => {
    it.each([['deeplink'], ['venueMap']])(
      'should log consult venue when URL from param equal to %s',
      async (from) => {
        renderVenue(venueId, from as Referrals)

        await waitFor(() => {
          expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
            venueId,
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
})

async function renderVenue(id: number, from?: Referrals) {
  useRoute.mockImplementation(() => ({ params: { id, from } }))
  render(reactQueryProviderHOC(<Venue />))
}
