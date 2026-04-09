import React from 'react'

import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('features/culturalSurvey/helpers/useGetNextQuestion')
jest.mock('features/navigation/helpers/openUrl')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')
jest.mock('libs/firebase/analytics/analytics')

describe('CulturalSurveyIntro page', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = render(<CulturalSurveyIntro />)

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
