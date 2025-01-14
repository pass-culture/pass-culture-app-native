import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoModal } from 'features/home/components/modules/video/VideoModal'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.useFakeTimers()

const hideModalMock = jest.fn()

const mockOffers = mockedAlgoliaResponse.hits

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('VideoModal', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should render correctly if modal visible', async () => {
    renderVideoModal()

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen).toMatchSnapshot()
  })

  it('should log HasDismissedModal when pressing close button', async () => {
    renderVideoModal()

    const closeButton = screen.getByTestId('Fermer la modale vidéo')

    await act(async () => {
      fireEvent.press(closeButton)
    })

    expect(analytics.logHasDismissedModal).toHaveBeenNthCalledWith(1, {
      moduleId: 'abcd',
      modalType: 'video',
      videoDuration: 267,
      seenDuration: 135,
    })
  })

  it('should render properly with FF on', async () => {
    // TODO(PC-33973): test passes with no FF on
    renderVideoModal()

    expect(await screen.findByText('Découvre Lujipeka')).toBeOnTheScreen()
  })
})

function renderVideoModal() {
  render(
    reactQueryProviderHOC(
      <VideoModal
        homeEntryId="xyz"
        visible
        hideModal={hideModalMock}
        offers={mockOffers}
        moduleId="abcd"
        isMultiOffer={false}
        {...videoModuleFixture}
      />
    )
  )
}
