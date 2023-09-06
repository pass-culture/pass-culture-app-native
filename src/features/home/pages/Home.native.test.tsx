import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

import { Home } from './Home'

const mockShouldShowSkeleton = false
jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => mockShouldShowSkeleton),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('libs/geolocation')

const mockStartTransaction = jest.fn()
jest.mock('shared/performance/usePerformanceCalculation/usePerformanceCalculation', () => ({
  usePerformanceCalculation: () => ({
    start: mockStartTransaction,
    finish: jest.fn(),
  }),
}))

describe('Home page', () => {
  useRoute.mockReturnValue({ params: undefined })

  mockUseHomepageData.mockReturnValue({
    modules: [formattedVenuesModule],
    homeEntryId: 'fakeEntryId',
  })

  it('should render correctly', async () => {
    useRoute.mockReturnValueOnce({ params: undefined })
    mockUseHomepageData.mockReturnValueOnce({
      modules: [formattedVenuesModule],
      id: 'fakeEntryId',
    })
    renderHome()

    await screen.findByText('Bienvenue !')

    expect(screen).toMatchSnapshot()
  })

  it('should log ConsultHome', async () => {
    useRoute.mockReturnValueOnce({ params: undefined })
    mockUseHomepageData.mockReturnValueOnce({
      modules: [formattedVenuesModule],
      id: 'fakeEntryId',
    })
    renderHome()
    await act(async () => {})

    expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, { homeEntryId: 'fakeEntryId' })
  })

  it('should start Sentry performance transaction to measure loading', async () => {
    useRoute.mockReturnValueOnce({ params: undefined })
    mockUseHomepageData.mockReturnValueOnce({
      modules: [formattedVenuesModule],
      homeEntryId: 'fakeEntryId',
    })

    renderHome()
    await act(async () => {})

    expect(mockStartTransaction).toHaveBeenCalledTimes(2)
  })
})

function renderHome() {
  render(<Home />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
