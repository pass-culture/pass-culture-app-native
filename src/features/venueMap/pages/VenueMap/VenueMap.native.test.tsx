import React from 'react'

import * as useGoBack from 'features/navigation/useGoBack'
import { VenueMap } from 'features/venueMap/pages/VenueMap/VenueMap'
import { useVenueTypeCodeActions } from 'features/venueMap/store/venueTypeCodeStore'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/venue/api/useVenueOffers')
jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('features/venueMap/store/venueTypeCodeStore')
const mockSetVenueTypeCode = jest.fn()
const mockUseVenueTypeCodeActions = useVenueTypeCodeActions as jest.Mock
mockUseVenueTypeCodeActions.mockReturnValue({ setVenueTypeCode: mockSetVenueTypeCode })

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<VenueMap />', () => {
  it('Should display venue map header', async () => {
    render(reactQueryProviderHOC(<VenueMap />))

    await waitFor(() => {
      expect(screen.getByText('Carte des lieux')).toBeOnTheScreen()
    })
  })

  it('Should handle go back action when pressing go back button', async () => {
    render(reactQueryProviderHOC(<VenueMap />))

    fireEvent.press(await screen.findByTestId('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('Should reset venue type code in store when pressing go back button', async () => {
    render(reactQueryProviderHOC(<VenueMap />))

    fireEvent.press(await screen.findByTestId('Revenir en arrière'))

    expect(mockSetVenueTypeCode).toHaveBeenNthCalledWith(1, null)
  })
})
