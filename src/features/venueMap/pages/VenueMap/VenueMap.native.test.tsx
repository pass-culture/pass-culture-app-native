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

jest.mock('@gorhom/bottom-sheet', () => {
  const ActualBottomSheet = jest.requireActual('@gorhom/bottom-sheet/mock').default

  class MockBottomSheet extends ActualBottomSheet {
    close() {
      this.props.onAnimate(0, -1)
    }
    expand() {
      this.props.onAnimate(0, 2)
    }
    collapse() {
      this.props.onAnimate(-1, 0)
    }
  }
  return {
    __esModule: true,
    ...require('@gorhom/bottom-sheet/mock'),
    default: MockBottomSheet,
  }
})

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
