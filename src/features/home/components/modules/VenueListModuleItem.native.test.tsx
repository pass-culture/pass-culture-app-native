import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueListModule } from 'features/home/components/modules/VenueListModule'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('<VenueListModule />', () => {
  it('should redirect to target venue when pressing on it', async () => {
    render(
      <VenueListModule
        venues={venuesSearchFixture.hits}
        moduleId="toto"
        homeVenuesListEntryId="tata"
      />
    )

    fireEvent.press(screen.getByText('Le Petit Rintintin 1'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'Venue', { id: 5543 })
    })
  })

  it('should trigger log ConsultVenue when pressing on venue list item', async () => {
    render(
      <VenueListModule
        venues={venuesSearchFixture.hits}
        moduleId="toto"
        homeVenuesListEntryId="tata"
      />
    )

    fireEvent.press(screen.getByText('Le Petit Rintintin 1'))

    await waitFor(() => {
      expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
        venueId: 5543,
        from: 'venueList',
        moduleId: 'toto',
        homeEntryId: 'tata',
      })
    })
  })
})
