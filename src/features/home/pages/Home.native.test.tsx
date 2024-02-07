import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

import { Home } from './Home'

const mockShouldShowSkeleton = false
jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => mockShouldShowSkeleton),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('libs/location')

const mockStartTransaction = jest.fn()
const mockFinishTransaction = jest.fn()
jest.mock('shared/performance/transactions', () => {
  const originalModule = jest.requireActual('shared/performance/transactions')

  return {
    ...originalModule,
    startTransaction: (s: string) => {
      mockStartTransaction(s)
    },
    finishTransaction: (s: string) => {
      mockFinishTransaction(s)
    },
  }
})

describe('Home page', () => {
  useRoute.mockReturnValue({ params: undefined })

  mockUseHomepageData.mockReturnValue({
    modules: [formattedVenuesModule],
    homeEntryId: 'fakeEntryId',
  })

  beforeEach(() => {
    mockServer.getApiV1<SubcategoriesResponseModelv2>('/subcategories/v2', placeholderData)
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

  it('should end Sentry performance transaction to measure component creation and home loading', async () => {
    useRoute.mockReturnValueOnce({ params: undefined })
    mockUseHomepageData.mockReturnValueOnce({
      modules: [formattedVenuesModule],
      homeEntryId: 'fakeEntryId',
    })

    renderHome()
    await act(async () => {})

    expect(mockFinishTransaction).toHaveBeenNthCalledWith(1, 'HOME:CREATION')
    expect(mockFinishTransaction).toHaveBeenNthCalledWith(2, 'HOME:LOADING')
  })
})

function renderHome() {
  render(<Home />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
