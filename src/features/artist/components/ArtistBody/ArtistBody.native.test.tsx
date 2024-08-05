import React from 'react'

import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

const mockUseOffer = jest.fn()
mockUseOffer.mockReturnValue({
  data: mockOffer,
})
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => mockUseOffer(),
}))

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

describe('<ArtistBody />', () => {
  it('should display header title', () => {
    render(reactQueryProviderHOC(<ArtistBody />))

    expect(screen.getByTestId('artistContainer')).toBeOnTheScreen()
  })
})
