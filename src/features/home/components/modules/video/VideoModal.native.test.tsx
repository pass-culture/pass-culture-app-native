import React from 'react'

import { VideoModal } from 'features/home/components/modules/video/VideoModal'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const hideModalMock = jest.fn()

const mockOffer = mockedAlgoliaResponse.hits[0]

describe('VideoModal', () => {
  it('should render correctly if modal visible', async () => {
    render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <VideoModal
          homeEntryId={'xyz'}
          visible
          hideModal={hideModalMock}
          offer={mockOffer}
          moduleId="abcd"
          {...videoModuleFixture}
        />
      )
    )

    await waitFor(() => {
      // We are searching for the translateY to be 0 to finish the animation of the modal in the snapshot
      expect(screen.getAllByRole(AccessibilityRole.DIALOG)[1]).toHaveStyle({
        transform: [{ translateY: 0 }],
      })
    })

    expect(screen).toMatchSnapshot()
  })

  it('should log HasDismissedModal when pressing close button', async () => {
    render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <VideoModal
          homeEntryId={'xyz'}
          visible
          hideModal={hideModalMock}
          offer={mockOffer}
          moduleId="abcd"
          {...videoModuleFixture}
        />
      )
    )

    const closeButton = screen.getByTestId('Fermer la modale vidéo')
    fireEvent.press(closeButton)

    await waitFor(() => {
      expect(analytics.logHasDismissedModal).toHaveBeenNthCalledWith(1, {
        moduleId: 'abcd',
        modalType: 'video',
      })
    })
  })
})
