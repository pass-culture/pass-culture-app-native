import React from 'react'

import { AppV2VenuesModule } from 'features/home/components/modules/venues/AppV2VenuesModule'
import { ModuleData } from 'features/home/types'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const props = {
  data: {
    playlistItems: venuesSearchFixture.hits,
    nbPlaylistResults: venuesSearchFixture.hits.length,
    moduleId: 'fakemoduleid',
  },
}

describe('<AppV2VenuesModule />', () => {
  it('should render correctly', () => {
    renderAppV2VenuesModule()

    expect(screen).toMatchSnapshot()
  })

  it('should not render list when data is undefined', () => {
    renderAppV2VenuesModule({ data: undefined })

    expect(
      screen.queryByText('Les lieux culturels à proximité'.toUpperCase())
    ).not.toBeOnTheScreen()
  })

  it('should return 4 venues maximum', () => {
    renderAppV2VenuesModule()

    expect(screen.queryByText('Le Petit Rintintin 5')).not.toBeOnTheScreen()
  })
})

const renderAppV2VenuesModule = (additionalProps: { data?: ModuleData } = {}) =>
  render(reactQueryProviderHOC(<AppV2VenuesModule {...props} {...additionalProps} />))
