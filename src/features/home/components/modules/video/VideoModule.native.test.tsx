import React from 'react'

import { useVideoOffer } from 'features/home/api/useVideoOffer'
import { VideoModule } from 'features/home/components/modules/video/VideoModule'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<VideoModule {...videoModuleFixture} />))
    await act(async () => {})

    const button = screen.getByTestId('video-thumbnail')

    fireEvent.press(button)
    expect(mockShowModal).toHaveBeenCalledTimes(1)
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
