import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { setSettings } from 'features/auth/context/setSettings'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { TutorialTypes } from 'features/tutorial/enums'
import { AgeSelectionFork } from 'features/tutorial/pages/AgeSelectionFork'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('AgeSelectionFork', () => {
  beforeEach(() => {
    useRoute.mockReturnValueOnce({ params: { type: TutorialTypes.ONBOARDING } })
    setFeatureFlags()
  })

  it('should not have basic accessibility', async () => {
    const { container } = renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => {
      setSettings({ wipEnableCreditV3: true })
    })

    it('should not have basic accessibility', async () => {
      const { container } = renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderAgeSelectionFork = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'AgeSelectionFork'
  >
  return render(<AgeSelectionFork {...navProps} />)
}
