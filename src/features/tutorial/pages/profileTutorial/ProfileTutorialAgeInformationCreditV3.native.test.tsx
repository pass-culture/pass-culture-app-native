import React from 'react'

import { mockSettings } from 'features/auth/context/mockSettings'
import { ProfileTutorialAgeInformationCreditV3 } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformationCreditV3'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
mockSettings()

jest.useFakeTimers()

describe('<ProfileTutorialAgeInformationCreditV3 />', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should render correctly', () => {
    render(<ProfileTutorialAgeInformationCreditV3 />)

    expect(screen).toMatchSnapshot()
  })

  it("should log to analytics when pressing 'Plus d’infos dans notre FAQ'", async () => {
    render(<ProfileTutorialAgeInformationCreditV3 />)

    const link = screen.getByText('Plus d’infos dans notre FAQ')
    await userEvent.press(link)

    expect(analytics.logHasClickedTutorialFAQ).toHaveBeenCalledTimes(1)
  })
})
