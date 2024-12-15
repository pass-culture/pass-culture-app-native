import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { act } from 'react-dom/test-utils'

import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { ProfileTutorialAgeInformation } from './ProfileTutorialAgeInformation'

jest.mock('libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate')

const navProps = { route: { params: { age: 15 } } } as StackScreenProps<
  TutorialRootStackParamList,
  'ProfileTutorialAgeInformation'
>

jest.mock('features/favorites/context/FavoritesWrapper')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<ProfileTutorialAgeInformation/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      const { container } = render(<ProfileTutorialAgeInformation {...navProps} />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
