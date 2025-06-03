import React from 'react'

import { Price } from 'features/search/components/sections/Price/Price'
import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'
import { render, screen, userEvent } from 'tests/utils'

let mockSearchState = initialSearchState

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('queries/profile/usePatchProfileMutation')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

const props = {
  currency: Currency.EURO,
  euroToPacificFrancRate: DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
}

describe('Price component', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display the search price description when minimum price selected', async () => {
    mockSearchState = { ...initialSearchState, minPrice: '5' }
    render(<Price {...props} />)

    await screen.findByText('Prix')

    expect(await screen.findByText('5\u00a0€ et plus')).toBeOnTheScreen()
  })

  it('should display the search price description when maximum price selected', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '10' }
    render(<Price {...props} />)

    await screen.findByText('Prix')

    expect(await screen.findByText('10\u00a0€ et moins')).toBeOnTheScreen()
  })

  it('should display the search price description when minimum and maximum prices selected', async () => {
    mockSearchState = { ...initialSearchState, minPrice: '5', maxPrice: '10' }
    render(<Price {...props} />)

    await screen.findByText('Prix')

    expect(await screen.findByText('de 5\u00a0€ à 10\u00a0€')).toBeOnTheScreen()
  })

  it('should display the search price description with "Gratuit" when minimum and maximum prices selected and are 0', async () => {
    mockSearchState = { ...initialSearchState, minPrice: '0', maxPrice: '0' }
    render(<Price {...props} />)

    await screen.findByText('Prix')

    expect(await screen.findByText('Gratuit')).toBeOnTheScreen()
  })

  it('should open the categories filter modal when clicking on the category button', async () => {
    render(<Price {...props} />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })

    const searchPriceButton = await screen.findByTestId('FilterRow')
    await user.press(searchPriceButton)

    const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeOnTheScreen()
  })
})
