import React from 'react'

import { VenuesModule } from 'features/home/components/modules/venues/VenuesModule'
import { ModuleData } from 'features/home/types'
import { mockVenues } from 'libs/algolia/__mocks__/mockedVenues'
import { DisplayParametersFields } from 'libs/contentful/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const props = {
  moduleId: 'fakemoduleid',
  displayParameters: { title: 'Module title', minOffers: 1 } as DisplayParametersFields,
  search: [],
  homeEntryId: 'fakeEntryId',
  index: 1,
  data: {
    playlistItems: mockVenues.hits,
    nbPlaylistResults: mockVenues.hits.length,
    moduleId: 'fakemoduleid',
  },
}

describe('VenuesModule component', () => {
  it('should render correctly', () => {
    renderVenuesModule()

    expect(screen).toMatchSnapshot()
  })

  it('should not render if data is undefined', () => {
    renderVenuesModule({ data: undefined })

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })
})

const renderVenuesModule = (additionalProps: { data?: ModuleData } = {}) =>
  render(reactQueryProviderHOC(<VenuesModule {...props} {...additionalProps} />))
