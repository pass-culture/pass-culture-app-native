import { SearchResponse } from '@algolia/client-search'
import AsyncStorage from '@react-native-async-storage/async-storage'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum, VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { CineContentCTAID } from 'features/offer/components/OfferCine/CineContentCTA'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { VenueMoviesOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContextModule from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { Network } from 'libs/share/types'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent, waitFor } from 'tests/utils'
import * as AnchorContextModule from 'ui/components/anchor/AnchorContext'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'

const getItemSpy = jest.spyOn(AsyncStorage, 'getItem')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}

const mockInView = jest.fn()
const InViewMock = ({
  onChange,
  children,
}: {
  onChange: VoidFunction
  children: React.ReactNode
}) => {
  mockInView.mockImplementation(onChange)
  return <React.Fragment>{children}</React.Fragment>
}

jest.mock('react-native-intersection-observer', () => {
  return {
    ...jest.requireActual('react-native-intersection-observer'),
    InView: InViewMock,
    mockInView,
  }
})

jest.useFakeTimers()

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')
jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/itinerary/useItinerary')
jest.mock('features/venue/api/useVenueOffers')
const mockUseVenueOffers = useVenueOffers as jest.Mock
mockUseVenueOffers.mockReturnValue({ hits: VenueMoviesOffersResponseSnap, nbHits: 4 },
  isLoading: false,)

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

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContextModule, 'useRemoteConfigContext')
const useScrollToAnchorSpy = jest.spyOn(AnchorContextModule, 'useScrollToAnchor')

const user = userEvent.setup()
let mockFFValue = false

describe('<Venue />', () => {
  beforeEach(() => {
    setFeatureFlags()
    getItemSpy.mockReset()
    mockServer.getApi<VenueResponse>(`/v1/venue/${venueId}`, venueDataTest)
  })

  // it('should match snapshot', async () => {
  //   renderVenue(venueId)

  //   await screen.findByText(`Envoyer sur ${Network.instagram}`)

  //   expect(screen).toMatchSnapshot()
  // })

  // it('should match snapshot with practical information', async () => {
  //   renderVenue(venueId)

  //   await user.press(await screen.findByText('Infos pratiques'))

  //   expect(screen).toMatchSnapshot()
  // })

  // it('should display video section with FF on', async () => {
  //   activateFeatureFlags([RemoteStoreFeatureFlags.WIP_FAKEDOOR_VIDEO_VENUE])
  //   renderVenue(venueId)

  //   expect(await screen.findByText('Vidéo de ce lieu')).toBeOnTheScreen()
  // })

  // it('should not display video player if video has already been seen', async () => {
  //   getItemSpy.mockResolvedValueOnce('true')
  //   activateFeatureFlags([RemoteStoreFeatureFlags.WIP_FAKEDOOR_VIDEO_VENUE])
  //   renderVenue(venueId)

  //   await waitFor(() => expect(screen.queryByText('Vidéo de ce lieu')).not.toBeOnTheScreen())
  // })

  // it('should hide video block once survey modal is closed', async () => {
  //   activateFeatureFlags([RemoteStoreFeatureFlags.WIP_FAKEDOOR_VIDEO_VENUE])
  //   renderVenue(venueId)

  //   await user.press(await screen.findByLabelText('Faux lecteur vidéo'))
  //   await user.press(await screen.findByLabelText('Fermer la modale'))

  //   await waitFor(() => expect(screen.queryByText('Vidéo de ce lieu')).not.toBeOnTheScreen())
  // })

  // it('should display default background image when no banner for venue', async () => {
  //   renderVenueContent()

  //   expect(await screen.findByTestId('defaultVenueBackground')).toBeOnTheScreen()
  // })

  // it('should display fake video player', async () => {
  //   renderVenueContent({ videoSectionVisible: true })

  //   expect(await screen.findByLabelText('Faux lecteur vidéo')).toBeOnTheScreen()
  // })

  // it('should open survey modal when fake video player is pressed', async () => {
  //   renderVenueContent({ videoSectionVisible: true })

  //   fireEvent.press(await screen.findByLabelText('Faux lecteur vidéo'))

  //   expect(mockShowModal).toHaveBeenCalledWith()
  // })

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

  describe('movie screening access button', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        showAccessScreeningButton: true,
      })
    })
    beforeEach(() => {
      mockServer.getApi<VenueResponse>(`/v1/venue/${venueId}`, {
        ...venueDataTest,
        venueTypeCode: VenueTypeCodeKey.MOVIE,
      })
    })
    mockFFValue = true

    // TODO(PC-33563): fix flaky tests
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should show button', async () => {
      renderVenue(venueId)

      await act(async () => {
        mockInView(false)
      })

      await screen.findByText('Les films à l’affiche')

      expect(await screen.findByTestId(CineContentCTAID)).toBeOnTheScreen()
    })

    it('should not show button', async () => {
      // renderVenueContent({
      //   venue: { ...venueDataTest, venueTypeCode: VenueTypeCodeKey.MOVIE },
      // })
      renderVenue(venueId)
      await act(async () => {
        mockInView(true)
      })

      await screen.findByText('Les films à l’affiche')

      expect(screen.queryByTestId(CineContentCTAID)).not.toBeOnTheScreen()
    })

    // TODO(PC-33563): fix flaky tests
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should scroll to anchor', async () => {
      // renderVenueContent({
      //   venue: { ...venueDataTest, venueTypeCode: VenueTypeCodeKey.MOVIE },
      // })
      renderVenue(venueId)

      await act(async () => {
        mockInView(false)
      })

      const button = await screen.findByTestId(CineContentCTAID)

      await userEvent.press(button)

      expect(useScrollToAnchorSpy).toHaveBeenCalledWith()
    })

    // TODO(PC-33563): fix flaky tests
    // eslint-disable-next-line jest/no-disabled-tests
    describe.skip('remote config flag is deactivated', () => {
      beforeAll(() => {
        useRemoteConfigContextSpy.mockReturnValue({
          ...DEFAULT_REMOTE_CONFIG,
          showAccessScreeningButton: false,
        })
      })

      it('should not display the button if the remote config flag is deactivated', async () => {
        // renderVenueContent({
        //   venue: { ...venueDataTest, venueTypeCode: VenueTypeCodeKey.MOVIE },
        // })
        renderVenue(venueId)

        await act(async () => {
          mockInView(false)
        })

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

const waitUntilRendered = async () => {
  // We wait until the full render is done
  // This is due to asynchronous calls to check the media on the phone
  await screen.findByText(`Envoyer sur ${Network.instagram}`)
}
