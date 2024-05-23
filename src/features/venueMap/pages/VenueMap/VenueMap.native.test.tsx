import React from 'react'

import { VenueMap } from 'features/venueMap/pages/VenueMap/VenueMap'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

describe('<VenueMap />', () => {
  it('Should display venue map header', async () => {
    render(reactQueryProviderHOC(<VenueMap />))

    await waitFor(() => {
      expect(screen.getByText('Carte des lieux')).toBeOnTheScreen()
    })
  })
})
