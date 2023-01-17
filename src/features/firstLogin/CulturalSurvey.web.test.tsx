import React from 'react'

import { useCurrentRoute } from 'features/navigation/helpers'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { CulturalSurvey } from './CulturalSurvey'

jest.mock('react-query')

jest.mock('features/auth/context/AuthContext')

jest.mock('features/navigation/helpers')
const mockedUseCurrentRoute = useCurrentRoute as jest.MockedFunction<typeof useCurrentRoute>
mockedUseCurrentRoute.mockReturnValue({ name: 'CulturalSurvey', key: 'key' })

describe('<CulturalSurvey/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<CulturalSurvey />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
