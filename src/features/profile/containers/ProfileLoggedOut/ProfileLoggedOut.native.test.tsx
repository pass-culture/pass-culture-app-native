import React from 'react'

import { ProfileLoggedOut } from 'features/profile/containers/ProfileLoggedOut/ProfileLoggedOut'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import * as useVersion from 'ui/hooks/useVersion'

jest.mock('libs/firebase/analytics/analytics')
jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.100.1')

describe('<ProfileLoggedOut />', () => {
  it('should match snapshot', async () => {
    render(
      reactQueryProviderHOC(
        <ProfileLoggedOut
          featureFlags={{
            enablePassForAll: true,
            enableProfileV2: true,
            disableActivation: false,
          }}
        />
      )
    )

    await screen.findByTestId('profile-logged-out')

    expect(screen).toMatchSnapshot()
  })
})
