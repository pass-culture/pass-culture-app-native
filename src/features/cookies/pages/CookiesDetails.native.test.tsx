import React from 'react'

import { CookiesDetails } from 'features/cookies/pages/CookiesDetails'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

jest.mock('queries/profile/usePatchProfileMutation')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('ui/components/anchor/AnchorContext', () => ({
  useScrollToAnchor: jest.fn,
  useRegisterAnchor: jest.fn,
}))

describe('<CookiesDetails/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', async () => {
    render(
      reactQueryProviderHOC(
        <CookiesDetails
          settingsCookiesChoice={{
            marketing: false,
            performance: false,
            customization: false,
            video: false,
          }}
          setSettingsCookiesChoice={jest.fn()}
        />
      )
    )

    await screen.findByText('À quoi servent tes cookies et tes données ?')

    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })
})
