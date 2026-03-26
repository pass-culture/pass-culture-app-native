import React from 'react'

import { VenuesModule } from 'features/home/components/modules/venues/VenuesModule'
import { ModuleData } from 'features/home/types'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { DisplayParametersFields } from 'libs/contentful/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const props = {
  moduleId: 'fakemoduleid',
  displayParameters: { title: 'Module title', minOffers: 1 } as DisplayParametersFields,
  search: [],
  homeEntryId: 'fakeEntryId',
  index: 1,
  data: {
    playlistItems: venuesSearchFixture.hits,
    nbPlaylistResults: venuesSearchFixture.hits.length,
    moduleId: 'fakemoduleid',
  },
}

describe('VenuesModule component', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    renderVenuesModule()

    expect(screen.getByTestId('offersModuleList')).toBeOnTheScreen()
  })

  it('should not render if data is undefined', () => {
    renderVenuesModule({ data: undefined })

    expect(screen.queryByTestId('offersModuleList')).toBeNull()
  })

  it('should not display new tag when wipEnableVolunteerNewTag FF deactivated and playlist has exclusively volunteering venues', () => {
    renderVenuesModule({
      displayParameters: { ...props.displayParameters, isExclusiveVolunteering: true },
    })

    expect(screen.queryByText('Nouveau')).not.toBeOnTheScreen()
  })

  describe('When wipEnableVolunteerNewTag FF activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_VOLUNTEER_NEW_TAG])
    })

    it('should display new tag if playlist has exclusively volunteering venues', () => {
      renderVenuesModule({
        displayParameters: { ...props.displayParameters, isExclusiveVolunteering: true },
      })

      expect(screen.getByText('Nouveau')).toBeOnTheScreen()
    })

    it('should not display new tag if playlist has not exclusively volunteering venues', () => {
      renderVenuesModule()

      expect(screen.queryByText('Nouveau')).not.toBeOnTheScreen()
    })
  })
})

const renderVenuesModule = (
  additionalProps: { data?: ModuleData; displayParameters?: DisplayParametersFields } = {}
) => render(reactQueryProviderHOC(<VenuesModule {...props} {...additionalProps} />))
