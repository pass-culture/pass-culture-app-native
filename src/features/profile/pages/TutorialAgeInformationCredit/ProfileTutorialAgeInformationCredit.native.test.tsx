import React from 'react'

import { ProfileTutorialAgeInformationCredit } from 'features/profile/pages/TutorialAgeInformationCredit/ProfileTutorialAgeInformationCredit'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

describe('<ProfileTutorialAgeInformationCredit />', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should render correctly', () => {
    render(<ProfileTutorialAgeInformationCredit />)

    expect(screen).toMatchSnapshot()
  })

  it("should log to analytics when pressing 'Plus d’infos dans notre FAQ'", async () => {
    render(<ProfileTutorialAgeInformationCredit />)

    const link = screen.getByText('Plus d’infos dans notre FAQ')
    await userEvent.press(link)

    expect(analytics.logHasClickedTutorialFAQ).toHaveBeenCalledTimes(1)
  })
})
