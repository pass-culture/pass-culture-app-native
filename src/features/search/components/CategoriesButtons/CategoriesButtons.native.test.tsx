import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { CategoriesButtons } from './CategoriesButtons'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

jest.mock('libs/subcategories/useSubcategories')

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('CategoriesButtons', () => {
  it('should display categories', async () => {
    render(<CategoriesButtons />)

    await waitFor(async () => {
      expect(screen.queryAllByRole('button')).toHaveLength(13)
    })
  })

  it('should navigate to search results with search params on press', async () => {
    render(<CategoriesButtons />)

    const categoryButton = screen.getByText('Spectacles')
    fireEvent.press(categoryButton)
    await waitFor(async () => {
      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: {
          params: {
            ...mockSearchState,
            offerSubcategories: [],
            offerNativeCategories: undefined,
            offerGenreTypes: undefined,
            searchId: 'testUuidV4',
            isFullyDigitalOffersCategory: undefined,
            isFromHistory: undefined,
            offerCategories: ['SPECTACLES'],
            accessibilityFilter: {
              isAudioDisabilityCompliant: undefined,
              isMentalDisabilityCompliant: undefined,
              isMotorDisabilityCompliant: undefined,
              isVisualDisabilityCompliant: undefined,
            },
          },
          screen: 'SearchResults',
        },
        screen: 'SearchStackNavigator',
      })
    })
  })
})
