import React, { useRef } from 'react'
import YouTube from 'react-youtube'

import MockedYouTubePlayer from '__mocks__/react-youtube'
import { VideoPlayerWeb } from 'features/home/components/modules/video/VideoPlayerWeb.web'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, waitFor } from 'tests/utils/web'

const mockOffer = mockedAlgoliaResponse.hits[0]
const hideModalMock = jest.fn()

jest.mock('libs/firebase/analytics/analytics')

describe('VideoPlayer', () => {
  describe('analytics', () => {
    it('should logHasSeenAllVideo when all video were seen', async () => {
      MockedYouTubePlayer.setPlayerStateData(YouTube.PlayerState.ENDED)

      renderVideoPlayer()

      await waitFor(() => {
        expect(analytics.logHasSeenAllVideo).toHaveBeenCalledWith({
          moduleId: 'abcd',
          videoDuration: 267,
          seenDuration: 135,
        })
      })
    })

    it('should logConsultVideo when player is ready', async () => {
      MockedYouTubePlayer.setPlayerStateData(YouTube.PlayerState.UNSTARTED)

      renderVideoPlayer()

      await waitFor(() => {
        expect(analytics.logConsultVideo).toHaveBeenCalledWith({
          from: 'home',
          homeEntryId: 'xyz',
          moduleId: 'abcd',
        })
      })
    })
  })
})

const Player = () => {
  const mockRef = useRef<YouTube>(null)
  return (
    <VideoPlayerWeb
      youtubeVideoId={videoModuleFixture.youtubeVideoId}
      offer={mockOffer}
      onPressSeeOffer={hideModalMock}
      moduleId="abcd"
      moduleName="lujipeka"
      homeEntryId="xyz"
      playerRef={mockRef}
    />
  )
}

function renderVideoPlayer() {
  render(reactQueryProviderHOC(<Player />))
}
