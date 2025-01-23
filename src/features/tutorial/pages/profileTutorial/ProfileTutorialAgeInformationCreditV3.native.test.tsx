import React from 'react'

import { ProfileTutorialAgeInformationCreditV3 } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformationCreditV3'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('libs/firebase/analytics/analytics')

describe('<ProfileTutorialAgeInformationCreditV3 />', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should render correctly', () => {
    render(<ProfileTutorialAgeInformationCreditV3 />)

    expect(screen).toMatchSnapshot()
  })
})
