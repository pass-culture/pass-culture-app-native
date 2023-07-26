import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, screen, measurePerformance } from 'tests/utils'

import { Home } from './Home'

const mockShouldShowSkeleton = false
jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => mockShouldShowSkeleton),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('libs/geolocation')

// Performance measuring is run 10 times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 20000
jest.setTimeout(TEST_TIMEOUT_IN_MS)
describe('<Home />', () => {
  useRoute.mockReturnValue({ params: undefined })

  mockUseHomepageData.mockReturnValue({
    modules: [formattedVenuesModule],
    homeEntryId: 'fakeEntryId',
  })

  it('Performance test for loading Home page', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    await measurePerformance(reactQueryProviderHOC(<Home />), {
      scenario: async () => {
        await screen.findByTestId('homeBodyScrollView', {}, { timeout: TEST_TIMEOUT_IN_MS })
        await act(async () => {})
      },
    })
  })
})
