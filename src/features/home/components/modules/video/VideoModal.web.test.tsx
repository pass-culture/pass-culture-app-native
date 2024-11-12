import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoModal } from 'features/home/components/modules/video/VideoModal.web'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils/web'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const hideModalMock = jest.fn()

const mockOffers = mockedAlgoliaResponse.hits

describe('VideoModal', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should render correctly', async () => {
    renderVideoModal()

    expect(await screen.findByText('Découvre Lujipeka')).toBeInTheDocument()
  })

  it('should render correctly with FF on', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)

    renderVideoModal()

    expect(await screen.findByText('Découvre Lujipeka')).toBeInTheDocument()
  })

  it('should log HasDismissedModal when pressing close button', async () => {
    renderVideoModal()

    const closeButton = screen.getByTestId('Fermer la modale vidéo')

    await act(async () => {
      fireEvent.click(closeButton)
    })

    expect(analytics.logHasDismissedModal).toHaveBeenNthCalledWith(1, {
      moduleId: 'abcd',
      modalType: 'video',
      videoDuration: 267,
      seenDuration: 135,
    })
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
