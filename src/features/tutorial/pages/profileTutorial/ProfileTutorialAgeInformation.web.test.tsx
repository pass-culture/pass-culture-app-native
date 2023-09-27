import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { act } from 'react-dom/test-utils'

import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ProfileTutorialAgeInformation } from './ProfileTutorialAgeInformation'

const navProps = { route: { params: { age: 15 } } } as StackScreenProps<
  TutorialRootStackParamList,
  'ProfileTutorialAgeInformation'
>

describe('<ProfileTutorialAgeInformation/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ProfileTutorialAgeInformation {...navProps} />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
