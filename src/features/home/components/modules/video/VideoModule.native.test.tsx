import React from 'react'

import { useVideoOffer } from 'features/home/api/useVideoOffer'
import { VideoModule } from 'features/home/components/modules/video/VideoModule'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

jest.mock('features/home/api/useVideoOffer')
const mockUseVideoOffer = useVideoOffer as jest.Mock

describe('VideoModule', () => {
  it('should show modal when pressing video thumbnail', async () => {
    mockUseVideoOffer.mockReturnValueOnce({ offer: offerFixture })
    render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<VideoModule {...videoModuleFixture} index={1} homeEntryId="abcd" />)
    )
    await act(async () => {})

    const button = screen.getByTestId('video-thumbnail')

    fireEvent.press(button)
    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should log ModuleDisplayedOnHomePage event when seeing the module', async () => {
    mockUseVideoOffer.mockReturnValueOnce({ offer: offerFixture })
    render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<VideoModule {...videoModuleFixture} index={1} homeEntryId="abcd" />)
    )

    await waitFor(() => {
      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(
        1,
        videoModuleFixture.id,
        'video',
        1,
        'abcd'
      )
    })
  })

  it('should not log ModuleDisplayedOnHomePage event when module is not rendered', async () => {
    mockUseVideoOffer.mockReturnValueOnce({ offer: undefined })
    render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<VideoModule {...videoModuleFixture} index={1} homeEntryId="abcd" />)
    )

    await waitFor(() => {
      expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
    })
  })
})

const offerFixture = {
  offer: {
    thumbUrl: 'http://thumbnail',
  },
  objectID: 1234,
  venue: {
    id: 5678,
  },
}
