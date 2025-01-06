import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import * as CookiesUpToDate from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedBusinessModule } from 'features/home/fixtures/homepage.fixture'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { Home } from './Home'

jest.mock('libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const mockShouldShowSkeleton = false
jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => mockShouldShowSkeleton),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('libs/location')

jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.spyOn(CookiesUpToDate, 'useIsCookiesListUpToDate').mockReturnValue({
  isCookiesListUpToDate: true,
  cookiesLastUpdate: { lastUpdated: new Date('10/12/2022'), lastUpdateBuildVersion: 10208002 },
}) // Cookies hook used in useShouldShowReactionModal

describe('<Home/>', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockUseHomepageData.mockReturnValueOnce({
        modules: [formattedBusinessModule],
        homeEntryId: 'fakeEntryId',
      })
      mockUseHomepageData.mockReturnValueOnce({
        modules: [formattedBusinessModule],
        homeEntryId: 'fakeEntryId',
      }) // Adding useShouldShowReactionModal to Home.tsx caused an extra render

      const { container } = render(<Home />, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      let results
      await act(async () => {
        results = await checkAccessibilityFor(container)
      })

      expect(results).toHaveNoViolations()
    })
  })
})
