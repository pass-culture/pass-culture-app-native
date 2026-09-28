import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { RecommendationApiParams, SubcategoriesResponseModelv2 } from 'api/gen'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

import { RecommendationModule } from './RecommendationModule'

const displayParameters: DisplayParametersFields = {
  title: 'Tes offres recommandées',
  minOffers: 2,
  layout: 'one-item-medium',
}

const defaultRecommendationApiParams: RecommendationApiParams = {
  callId: '1',
  recoOrigin: 'unknown',
}

const mockUseHomeRecommendedOffers = jest.fn().mockReturnValue({
  offers: mockedAlgoliaResponse.hits,
  recommendationApiParams: defaultRecommendationApiParams,
})

jest.mock('features/home/api/useHomeRecommendedOffers', () => ({
  useHomeRecommendedOffers: () => mockUseHomeRecommendedOffers(),
}))

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('RecommendationModule', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', async () => {
    renderRecommendationModule()

    await waitFor(() => {
      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
        call_id: '1',
        moduleId: 'abcd',
        moduleType: ContentTypes.RECOMMENDATION,
        index: 1,
        homeEntryId: 'xyz',
        offers: ['102280', '102272', '102249', '102310'],
      })
    })
  })

  it('should not trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is false', async () => {
    const minOffers = mockedAlgoliaResponse.hits.length + 1
    renderRecommendationModule({ ...displayParameters, minOffers })

    await waitFor(() => {
      expect(screen.toJSON()).toBeNull()
    })

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })

  it('should not display RecommendationModule if no offer', async () => {
    mockUseHomeRecommendedOffers.mockReturnValueOnce({
      offers: [],
      recommendationApiParams: defaultRecommendationApiParams,
    })
    renderRecommendationModule()

    await waitFor(() => {
      expect(screen.toJSON()).toBeNull()
    })
  })

  it('should navigate to vertical playlist screen when pressing see all button', async () => {
    renderRecommendationModule()

    await user.press(screen.getByLabelText('Voir tout pour la sélection Tes offres recommandées'))

    expect(navigate).toHaveBeenCalledWith('VerticalPlaylistOffers', {
      module: {
        displayParameters,
        id: 'abcd',
        type: 'RecommendedOffersModule',
      },
      type: VerticalPlaylist.RecommendationOffers,
    })
  })
})

const renderRecommendationModule = (additionalDisplayParams?: DisplayParametersFields) =>
  render(
    reactQueryProviderHOC(
      <RecommendationModule
        index={1}
        moduleId="abcd"
        homeEntryId="xyz"
        displayParameters={additionalDisplayParams || displayParameters}
      />
    )
  )
