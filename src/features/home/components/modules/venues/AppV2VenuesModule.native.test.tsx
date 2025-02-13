import React from 'react'

import { AppV2VenuesModule } from 'features/home/components/modules/venues/AppV2VenuesModule'
import { ModuleData } from 'features/home/types'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const props = {
  moduleId: 'fakemoduleid',
  index: 1,
  data: {
    playlistItems: venuesSearchFixture.hits,
    nbPlaylistResults: venuesSearchFixture.hits.length,
    moduleId: 'fakemoduleid',
  },
  homeEntryId: 'homeEntryId',
}

describe('<AppV2VenuesModule />', () => {
  it('should log ModuleDisplayedOnHomePage event when seeing the module', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_LIST])

    renderAppV2VenuesModule()

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      moduleId: 'fakemoduleid',
      moduleType: 'venuesPlaylistAppV2',
      index: 1,
      homeEntryId: 'homeEntryId',
      venues: ['5543', '5544', '5545', '5546'],
    })
  })

  it('should not render list when data is undefined', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_LIST])

    renderAppV2VenuesModule({ data: undefined })

    expect(
      screen.queryByText('Les lieux culturels à proximité'.toUpperCase())
    ).not.toBeOnTheScreen()
  })

  it('should return 4 venues maximum when home id', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_LIST])

    renderAppV2VenuesModule()

    expect(screen.queryByText('Le Petit Rintintin 5')).not.toBeOnTheScreen()
  })

  it('should not render list when feature flag deactivated', () => {
    setFeatureFlags()

    renderAppV2VenuesModule()

    expect(
      screen.queryByText('Les lieux culturels à proximité'.toUpperCase())
    ).not.toBeOnTheScreen()
  })
})

const renderAppV2VenuesModule = (
  additionalProps: { data?: ModuleData; homeEntryId?: string } = {}
) => render(reactQueryProviderHOC(<AppV2VenuesModule {...props} {...additionalProps} />))
