import React from 'react'

import { ProfileTutorialAgeInformationCredit } from 'features/profile/pages/TutorialAgeInformationCredit/ProfileTutorialAgeInformationCredit'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('<ProfileTutorialAgeInformationCredit />', () => {
  beforeEach(() => setFeatureFlags([]))

  describe('with bonification disabled', () => {
    it('should render correctly', () => {
      render(<ProfileTutorialAgeInformationCredit />)

      expect(screen).toMatchSnapshot()
    })
  })

  describe('with bonification enabled', () => {
    beforeEach(() => {
      setFeatureFlags([
        RemoteStoreFeatureFlags.ENABLE_BONIFICATION,
        RemoteStoreFeatureFlags.ENABLE_HANDICAP_BONIFICATION,
      ])
    })

    it('should render correctly', () => {
      render(<ProfileTutorialAgeInformationCredit />)

      expect(screen).toMatchSnapshot()
    })
  })
})
