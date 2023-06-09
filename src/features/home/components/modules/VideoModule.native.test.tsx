import React from 'react'

import { VideoModule } from 'features/home/components/modules/VideoModule'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { fireEvent, render, screen } from 'tests/utils'

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

describe('VideoModule', () => {
  it('should show modal when pressing video thumbnail', () => {
    render(<VideoModule {...videoModuleFixture} />)
    const button = screen.getByTestId('video-thumbnail')

    fireEvent.press(button)
    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })
})
