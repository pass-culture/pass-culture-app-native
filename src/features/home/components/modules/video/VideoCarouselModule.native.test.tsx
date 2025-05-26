import React from 'react'
import { PLAYER_STATES } from 'react-native-youtube-iframe'

import { navigate } from '__mocks__/@react-navigation/native'
import MockedYouTubePlayer from '__mocks__/react-native-youtube-iframe'
import { VideoPlayerButtonsWording } from 'features/home/components/modules/video/VerticalVideoPlayer'
import { VideoCarouselModule } from 'features/home/components/modules/video/VideoCarouselModule'
import {
  videoCarouselModuleFixture,
  VideoCarouselModuleFixtureType,
} from 'features/home/fixtures/videoCarouselModule.fixture'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import * as fetchAlgoliaOffer from 'libs/algolia/fetchAlgolia/fetchCarouselVideoOffers'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockFetchCarouselVideoOffers = jest
  .spyOn(fetchAlgoliaOffer, 'fetchCarouselVideoOffers')
  .mockResolvedValue([mockedAlgoliaResponse])

const DEFAULT_ITEM_WITH_OFFER_ID = videoCarouselModuleFixture.items[0]
const DEFAULT_ITEM_WITH_TAG = videoCarouselModuleFixture.items[1]
const DEFAULT_ITEM_WITH_HOME_ENTRY_ID = videoCarouselModuleFixture.items[2]
const MOCKED_ALGOLIA_RESPONSE_OFFER = mockedAlgoliaResponse.hits[0]

// TODO(PC-33562): fix flaky tests
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('<VideoCarouselModule />', () => {
  beforeEach(() => {
    MockedYouTubePlayer.setPlayerState(PLAYER_STATES.UNSTARTED)
    MockedYouTubePlayer.setError(false)
    setFeatureFlags()
  })

  it('should call fetchCarouselVideoOffers with properly formatted data', async () => {
    renderVideoCarouselModule(videoCarouselModuleFixture)

    await screen.findByText(MOCKED_ALGOLIA_RESPONSE_OFFER.offer.name)

    expect(mockFetchCarouselVideoOffers).toHaveBeenCalledWith([
      {
        indexName: 'algoliaOffersIndexName',
        query: '',
        params: {
          facetFilters: [
            ['offer.isEducational:false'],
            [`objectID:${DEFAULT_ITEM_WITH_OFFER_ID.offerId}`],
          ],
          numericFilters: [['offer.prices: 0 TO 300']],
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
        },
      },
      {
        indexName: 'algoliaOffersIndexName',
        query: '',
        params: {
          facetFilters: [
            ['offer.isEducational:false'],
            [`offer.tags:${DEFAULT_ITEM_WITH_TAG.tag}`],
          ],
          numericFilters: [['offer.prices: 0 TO 300']],
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
        },
      },
    ])
  })

  it('should call fetchCarouselVideoOffers with empty array when item has homeEntryId', async () => {
    const VIDEO_CAROUSEL_MODULE_FIXTURE_WITH_ITEM_HAVING_HOMEENTRYID = {
      ...videoCarouselModuleFixture,
      items: [DEFAULT_ITEM_WITH_HOME_ENTRY_ID],
    }

    renderVideoCarouselModule(VIDEO_CAROUSEL_MODULE_FIXTURE_WITH_ITEM_HAVING_HOMEENTRYID)

    await screen.findByText(DEFAULT_ITEM_WITH_HOME_ENTRY_ID.thematicHomeTitle)

    expect(mockFetchCarouselVideoOffers).toHaveBeenCalledWith([])
  })

  it('should not render carousel with only one item', async () => {
    const VIDEO_CAROUSEL_MODULE_FIXTURE_WITH_ONE_ITEM = {
      ...videoCarouselModuleFixture,
      items: [DEFAULT_ITEM_WITH_OFFER_ID],
    }

    renderVideoCarouselModule(VIDEO_CAROUSEL_MODULE_FIXTURE_WITH_ONE_ITEM)

    await screen.findByText(MOCKED_ALGOLIA_RESPONSE_OFFER.offer.name)

    expect(screen.queryByTestId('videoCarousel')).not.toBeOnTheScreen()
  })

  it('should render carousel with multiple items', async () => {
    renderVideoCarouselModule(videoCarouselModuleFixture)

    await screen.findByText(MOCKED_ALGOLIA_RESPONSE_OFFER.offer.name)

    expect(screen.getByTestId('videoCarousel')).toBeOnTheScreen()
  })

  it('should render video player correctly', async () => {
    renderVideoCarouselModule(videoCarouselModuleFixture)

    await screen.findByText(MOCKED_ALGOLIA_RESPONSE_OFFER.offer.name)

    const verticalVideoPlayerButton = await screen.findByRole(AccessibilityRole.BUTTON, {
      name: 'Mettre en pause la vidéo',
    })

    expect(verticalVideoPlayerButton).toBeOnTheScreen()
  })

  it('should redirect to thematic home when item has an homeEntryId', async () => {
    const HOME_ENTRY_ID = DEFAULT_ITEM_WITH_HOME_ENTRY_ID.homeEntryId
    const THEMATIC_HOME_TITLE = DEFAULT_ITEM_WITH_HOME_ENTRY_ID.thematicHomeTitle
    const MODULE_ITEM_ID = DEFAULT_ITEM_WITH_HOME_ENTRY_ID.id
    const MODULE_ID = videoCarouselModuleFixture.id

    renderVideoCarouselModule(videoCarouselModuleFixture)

    await screen.findByText(MOCKED_ALGOLIA_RESPONSE_OFFER.offer.name)

    const attachedOfferButton = screen.getByText(THEMATIC_HOME_TITLE)
    fireEvent.press(attachedOfferButton)

    expect(navigate).toHaveBeenCalledWith('ThematicHome', {
      homeId: HOME_ENTRY_ID,
      from: 'video_carousel_block',
      moduleId: MODULE_ID,
      moduleItemId: MODULE_ITEM_ID,
    })
  })

  it('should redirect to offer based on offerId', async () => {
    const OFFER_NAME = MOCKED_ALGOLIA_RESPONSE_OFFER.offer.name
    const OFFER_ID = MOCKED_ALGOLIA_RESPONSE_OFFER.objectID

    renderVideoCarouselModule({
      ...videoCarouselModuleFixture,
      items: [DEFAULT_ITEM_WITH_OFFER_ID],
    })

    const attachedOfferButton = await screen.findByText(OFFER_NAME)
    await act(async () => fireEvent.press(attachedOfferButton))

    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: +OFFER_ID,
    })
  })

  describe('tracking', () => {
    it('should send logConsultVideo when video starts autoplay', async () => {
      renderVideoCarouselModule(videoCarouselModuleFixture)

      await screen.findByText(MOCKED_ALGOLIA_RESPONSE_OFFER.offer.name)

      expect(analytics.logConsultVideo).toHaveBeenNthCalledWith(1, {
        from: 'video_carousel_block',
        moduleId: videoCarouselModuleFixture.id,
        homeEntryId: videoCarouselModuleFixture.homeEntryId,
        youtubeId: videoCarouselModuleFixture.items[2].youtubeVideoId,
      })
    })

    it('should send logConsultVideo event when user presses `next video button`', async () => {
      MockedYouTubePlayer.setPlayerState(PLAYER_STATES.ENDED)

      renderVideoCarouselModule(videoCarouselModuleFixture)

      const nextVideoButton = await screen.findByRole(AccessibilityRole.BUTTON, {
        name: VideoPlayerButtonsWording.NEXT_VIDEO,
      })
      await act(async () => fireEvent.press(nextVideoButton))

      await waitFor(() => {
        expect(analytics.logConsultVideo).toHaveBeenNthCalledWith(1, {
          from: 'video_carousel_block',
          moduleId: videoCarouselModuleFixture.id,
          homeEntryId: videoCarouselModuleFixture.homeEntryId,
          youtubeId: videoCarouselModuleFixture.items[2].youtubeVideoId,
        })
      })
    })

    it('should send logConsultOffer event when user presses on offer', async () => {
      const OFFER_NAME = MOCKED_ALGOLIA_RESPONSE_OFFER.offer.name
      const OFFER_ID = MOCKED_ALGOLIA_RESPONSE_OFFER.objectID

      renderVideoCarouselModule({
        ...videoCarouselModuleFixture,
        items: [DEFAULT_ITEM_WITH_OFFER_ID],
      })

      const attachedOfferButton = await screen.findByText(OFFER_NAME)
      await act(async () => fireEvent.press(attachedOfferButton))

      expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
        offerId: +OFFER_ID,
        moduleId: videoCarouselModuleFixture.items[0].id,
        from: 'video_carousel_block',
        homeEntryId: undefined,
      })
    })

    it('should send logModuleDisplayedOnHomepage event', async () => {
      const OFFER_NAME = MOCKED_ALGOLIA_RESPONSE_OFFER.offer.name

      renderVideoCarouselModule(videoCarouselModuleFixture)

      await screen.findByText(OFFER_NAME)

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
        moduleId: videoCarouselModuleFixture.id,
        moduleType: ContentTypes.VIDEO_CAROUSEL,
        index: videoCarouselModuleFixture.index,
        homeEntryId: videoCarouselModuleFixture.homeEntryId,
      })
    })
  })
})

const renderVideoCarouselModule = (props: VideoCarouselModuleFixtureType) => {
  render(<VideoCarouselModule {...props} />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
