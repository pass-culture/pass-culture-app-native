import React from 'react'

import { VenueListModule } from 'features/home/components/modules/VenueListModule'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils/web'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('<VenueListModule />', () => {
  it('should not display right arrow icon on web', () => {
    render(<VenueListModule venues={venuesSearchFixture.hits} />)

    expect(screen.queryByTestId('arrow-right')).not.toBeOnTheScreen()
  })
})
