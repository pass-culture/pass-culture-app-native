import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { PersonalDataTypes } from 'features/navigation/navigators/ProfileStackNavigator/enums'
import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('ChangeCity', () => {
  beforeEach(() => {
    useRoute.mockReturnValue({ params: { type: PersonalDataTypes.PROFIL_PERSONAL_DATA } })
  })

  it('should render correctly', () => {
    const { container } = render(reactQueryProviderHOC(<ChangeCity />))

    expect(container).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = await renderAccessibility()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderAccessibility = async () =>
  act(async () => {
    return render(reactQueryProviderHOC(<ChangeCity />))
  })
