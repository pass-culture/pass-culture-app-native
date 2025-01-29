import { useVerticalVideoPlayer } from 'features/home/components/modules/video/useVerticalVideoPlayer'
import { analytics } from 'libs/analytics/provider'
import { renderHook, waitFor } from 'tests/utils'

const mockProps = {
  isPlaying: true,
  setIsPlaying: jest.fn(),
  setHasFinishedPlaying: jest.fn(),
  moduleId: '123456',
  currentVideoId: 'TEST_ID_VIDEO',
  homeEntryId: '123456',
}

describe('useVerticalVideoPlayer', () => {
  it('should log videoPaused when video was playing and togglePlay is called', async () => {
    const { result } = renderHook(() => useVerticalVideoPlayer(mockProps))

    result.current.togglePlay()

    await waitFor(() => {
      expect(analytics.logVideoPaused).toHaveBeenNthCalledWith(1, {
        videoDuration: 0,
        seenDuration: 0,
        youtubeId: mockProps.currentVideoId,
        homeEntryId: mockProps.homeEntryId,
        moduleId: mockProps.moduleId,
      })
    })
  })
})
