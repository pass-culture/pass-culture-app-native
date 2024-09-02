import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import * as useGoBack from 'features/navigation/useGoBack'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const mockUseOffer = jest.fn()
mockUseOffer.mockReturnValue({
  data: {
    ...mockOffer,
    subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD,
    extraData: { performer: 'Céline Dion, Sia' },
  },
})
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => mockUseOffer(),
}))

useRoute.mockReturnValue({
  params: {
    fromOfferId: 1,
  },
})

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('<ArtistBody />', () => {
  it('should display only the main artist when there are several artists on header title', () => {
    render(reactQueryProviderHOC(<ArtistBody />))

    expect(screen.getAllByText('Céline Dion')[0]).toBeOnTheScreen()
  })

  it('should call goBack when pressing the back button', () => {
    render(reactQueryProviderHOC(<ArtistBody />))
    const backButton = screen.getByTestId('Revenir en arrière')
    fireEvent.press(backButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})
