import mockdate from 'mockdate'
import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import {
  ArtistPlaylistModule,
  ArtistPlaylistModuleProps,
} from 'features/home/components/modules/ArtistPlaylistModule'
import { OffersModuleParameters, HomepageModuleType } from 'features/home/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { ThemeProvider } from 'libs/styled'
import { ColorScheme } from 'libs/styled/useColorScheme'
import { Offer } from 'shared/offer/types'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { computedTheme } from 'tests/computedTheme'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent, waitFor } from 'tests/utils'

mockdate.set(new Date(2020, 10, 16))

const mockHitsItems: Offer[] = [mockedAlgoliaResponse.hits[0], mockedAlgoliaResponse.hits[1]]
const mockNbHits = mockHitsItems.length
const mockData = {
  playlistItems: mockHitsItems,
  nbPlaylistResults: mockNbHits,
  moduleId: 'fakeModuleId',
}

const props = {
  offersModuleParameters: [{} as OffersModuleParameters],
  displayParameters: {
    minOffers: 0,
    title: 'Module title',
    layout: 'one-item-medium',
  } as DisplayParametersFields,
  moduleId: 'fakeModuleId',
  position: null,
  homeEntryId: 'fakeEntryId',
  index: 1,
  data: mockData,
  artistId: mockArtist.id,
}

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

jest.mock('features/auth/context/AuthContext')

jest.mock('queries/subcategories/useSubcategoriesQuery')

jest.mock('api/api')

const user = userEvent.setup()
jest.useFakeTimers()

describe('ArtistPlaylistModule', () => {
  beforeEach(() => {
    setFeatureFlags()
    const mockApi = jest.mocked(api)
    mockApi.getNativeV1ArtistsartistId.mockResolvedValue(mockArtist)
  })

  it('should not render if data is undefined', () => {
    renderArtistPlaylistModule({ data: undefined })

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })

  it('should not display module if artist is undefined', () => {
    renderArtistPlaylistModule({
      data: { playlistItems: mockHitsItems, nbPlaylistResults: 10, moduleId: 'fakeModuleId' },
      artistId: undefined,
    })

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })

  it('should not display module if artist query fails', async () => {
    const mockApi = jest.mocked(api)
    mockApi.getNativeV1ArtistsartistId.mockRejectedValueOnce(new Error('404: Artist not found'))

    renderArtistPlaylistModule()

    await waitFor(() => {
      expect(screen.toJSON()).not.toBeOnTheScreen()
    })
  })

  it('should navigate to vertical playlist when we click on "Voir tout"', async () => {
    renderArtistPlaylistModule({
      data: { playlistItems: mockHitsItems, nbPlaylistResults: 10, moduleId: 'fakeModuleId' },
    })

    await user.press(await screen.findByText('Voir tout'))

    expect(navigate).toHaveBeenCalledWith('VerticalPlaylistOffers', {
      type: VerticalPlaylist.ModuleArtistPlaylist,
      module: {
        id: 'fakeModuleId',
        title: 'Module title',
        type: HomepageModuleType.ArtistPlaylistModule,
        offersModuleParameters: [{}],
        displayParameters: {
          layout: 'one-item-medium',
          minOffers: 0,
          title: 'Module title',
        },
        artistId: mockArtist.id,
      },
    })
  })

  it('should display artist button and redirect to artist page when pressing it', async () => {
    renderArtistPlaylistModule({
      data: { playlistItems: mockHitsItems, nbPlaylistResults: 10, moduleId: 'fakeModuleId' },
      artistId: mockArtist.id,
    })

    await user.press(await screen.findByLabelText('Accéder à la page artiste de Avril Lavigne'))

    expect(navigate).toHaveBeenCalledWith('Artist', { id: mockArtist.id })
  })

  it('should display right filled icon on artist button', async () => {
    renderArtistPlaylistModule({
      data: { playlistItems: mockHitsItems, nbPlaylistResults: 10, moduleId: 'fakeModuleId' },
      artistId: mockArtist.id,
    })

    await screen.findByLabelText('Accéder à la page artiste de Avril Lavigne')

    expect(screen.getByTestId('RightFilled')).toBeOnTheScreen()
  })

  describe('Analytics', () => {
    it('should trigger logEvent "AllTilesSeen" only once', async () => {
      renderArtistPlaylistModule()
      const scrollView = await screen.findByTestId('offersModuleList')

      await act(async () => {
        // 1st scroll to last item => trigger
        await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      })

      expect(analytics.logAllTilesSeen).toHaveBeenCalledWith({
        apiRecoParams: undefined,
        moduleName: props.displayParameters.title,
        numberOfTiles: mockNbHits,
      })
      expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)

      await act(async () => {
        await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      })

      expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)
    })

    it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', async () => {
      renderArtistPlaylistModule()

      await screen.findByLabelText('Module title')

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
        call_id: undefined,
        hybridModuleOffsetIndex: undefined,
        moduleId: props.moduleId,
        moduleType: ContentTypes.ARTIST_PLAYLIST,
        index: props.index,
        homeEntryId: props.homeEntryId,
        offers: ['102280', '102272'],
      })
    })

    it('should not trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is false', () => {
      renderArtistPlaylistModule({
        offersModuleParameters: [{ title: 'Search title' } as OffersModuleParameters],
        displayParameters: { ...props.displayParameters, minOffers: mockNbHits + 1 },
      })

      expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
    })

    it('should trigger analytics when we click on "Voir tout" button', async () => {
      renderArtistPlaylistModule({
        data: { playlistItems: mockHitsItems, nbPlaylistResults: 10, moduleId: 'fakeModuleId' },
      })

      await user.press(await screen.findByText('Voir tout'))

      expect(analytics.logClickSeeAll).toHaveBeenCalledWith({
        from: 'home',
        type: 'offers',
        moduleId: 'fakeModuleId',
        moduleName: 'Module title',
      })
    })

    it('should trigger ConsultArtist log when pressing artist button', async () => {
      renderArtistPlaylistModule({
        data: { playlistItems: mockHitsItems, nbPlaylistResults: 10, moduleId: 'fakeModuleId' },
        artistId: mockArtist.id,
      })

      await user.press(await screen.findByLabelText('Accéder à la page artiste de Avril Lavigne'))

      expect(analytics.logConsultArtist).toHaveBeenCalledWith({
        artistId: mockArtist.id,
        artistName: mockArtist.name,
        from: 'home',
        originDetails: 'artistRecommendation',
      })
    })
  })

  describe('When disableArtistNavigation prop is true', () => {
    it('should not navigate on artist page', async () => {
      renderArtistPlaylistModule({
        data: { playlistItems: mockHitsItems, nbPlaylistResults: 10, moduleId: 'fakeModuleId' },
        artistId: mockArtist.id,
        disableArtistNavigation: true,
      })

      await screen.findByText('te partage ses pépites')

      expect(
        screen.queryByLabelText('Accéder à la page artiste de Avril Lavigne')
      ).not.toBeOnTheScreen()
    })

    it('should not display right filled icon on artist header', async () => {
      renderArtistPlaylistModule({
        data: { playlistItems: mockHitsItems, nbPlaylistResults: 10, moduleId: 'fakeModuleId' },
        artistId: mockArtist.id,
        disableArtistNavigation: true,
      })

      await screen.findByText('te partage ses pépites')

      expect(screen.queryByTestId('RightFilled')).not.toBeOnTheScreen()
    })
  })
})

const renderArtistPlaylistModule = (additionalProps: Partial<ArtistPlaylistModuleProps> = {}) =>
  render(
    reactQueryProviderHOC(
      <ThemeProvider theme={computedTheme} colorScheme={ColorScheme.LIGHT}>
        <ArtistPlaylistModule {...props} {...additionalProps} />
      </ThemeProvider>
    )
  )
