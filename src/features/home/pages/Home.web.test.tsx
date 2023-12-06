import React from 'react'

import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedBusinessModule } from 'features/home/fixtures/homepage.fixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { Home } from './Home'

const mockShouldShowSkeleton = false
jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => mockShouldShowSkeleton),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('libs/location')

jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag')

describe('<Home/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockUseHomepageData.mockReturnValueOnce({
        modules: [formattedBusinessModule],
        homeEntryId: 'fakeEntryId',
      })

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
