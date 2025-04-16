import React from 'react'

import { CookiesDetails } from 'features/cookies/pages/CookiesDetails'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { screen, render } from 'tests/utils'

jest.mock('queries/profile/usePatchProfileMutation')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<CookiesDetails/>', () => {
  it('should render correctly', async () => {
    render(
      reactQueryProviderHOC(
        <CookiesDetails
          settingsCookiesChoice={{
            marketing: false,
            performance: false,
            customization: false,
          }}
          setSettingsCookiesChoice={jest.fn()}
        />
      )
    )

    await screen.findByText('À quoi servent tes cookies et tes données ?')

    expect(screen).toMatchSnapshot()
  })
})
