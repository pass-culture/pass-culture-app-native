import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueListModule } from 'features/home/components/modules/VenueListModule.web'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { analytics } from 'libs/analytics/provider'
import { fireEvent, render, screen, waitFor } from 'tests/utils/web'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<VenueListModule />', () => {
  it('should redirect to thematic home', async () => {
    render(
      <VenueListModule
        venues={venuesSearchFixture.hits}
        moduleId="toto"
        homeVenuesListEntryId="123"
        moduleName="tata"
      />
    )

    fireEvent.click(screen.getByText('Voir tout'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'ThematicHome', {
        from: 'venueList',
        homeId: '123',
        moduleId: 'toto',
      })
    })
  })

  it('should trigger log ClickSeeMore when pressing on "Voir tout" button', async () => {
    render(
      <VenueListModule
        venues={venuesSearchFixture.hits}
        moduleId="toto"
        homeVenuesListEntryId="123"
        moduleName="tata"
      />
    )

    fireEvent.click(screen.getByText('Voir tout'))

    await waitFor(() => {
      expect(analytics.logClickSeeMore).toHaveBeenNthCalledWith(1, {
        from: 'venueList',
        moduleId: 'toto',
        moduleName: 'tata',
        homeEntryId: '123',
      })
    })
  })
})
