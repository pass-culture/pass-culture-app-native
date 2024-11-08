import React from 'react'

import { Price } from 'features/search/components/sections/Price/Price'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, screen } from 'tests/utils'

let mockSearchState = initialSearchState

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/profile/api/useUpdateProfileMutation')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('Price component', () => {
  it('should display the search price description when minimum price selected', async () => {
    mockSearchState = { ...initialSearchState, minPrice: '5' }
    render(<Price />)

    await screen.findByText('Prix')

    expect(await screen.findByText('5\u00a0€ et plus')).toBeOnTheScreen()
  })

  it('should display the search price description when maximum price selected', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '10' }
    render(<Price />)

    await screen.findByText('Prix')

    expect(await screen.findByText('10\u00a0€ et moins')).toBeOnTheScreen()
  })

  it('should display the search price description when minimum and maximum prices selected', async () => {
    mockSearchState = { ...initialSearchState, minPrice: '5', maxPrice: '10' }
    render(<Price />)

    await screen.findByText('Prix')

    expect(await screen.findByText('de 5\u00a0€ à 10\u00a0€')).toBeOnTheScreen()
  })

  it('should display the search price description with "Gratuit" when minimum and maximum prices selected and are 0', async () => {
    mockSearchState = { ...initialSearchState, minPrice: '0', maxPrice: '0' }
    render(<Price />)

    await screen.findByText('Prix')

    expect(await screen.findByText('Gratuit')).toBeOnTheScreen()
  })

  it('should open the categories filter modal when clicking on the category button', async () => {
    render(<Price />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })
    const searchPriceButton = await screen.findByTestId('FilterRow')

    fireEvent.press(searchPriceButton)

    const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeOnTheScreen()
  })
})
