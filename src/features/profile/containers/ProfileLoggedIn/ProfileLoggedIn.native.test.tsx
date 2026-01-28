import React from 'react'

import * as LogoutRoutine from 'features/auth/helpers/useLogoutRoutine'
import { ProfileLoggedIn } from 'features/profile/containers/ProfileLoggedIn/ProfileLoggedIn'
import { beneficiaryUser } from 'fixtures/user'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import * as useVersion from 'ui/hooks/useVersion'

jest.mock('libs/firebase/analytics/analytics')

jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.100.1')

const logoutRoutineMock = jest.fn()
jest.spyOn(LogoutRoutine, 'useLogoutRoutine').mockReturnValue(logoutRoutineMock)

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ProfileLoggedIn />', () => {
  it('should match snapshot', async () => {
    await renderProfileLoggedIn({ user: beneficiaryUser })

    expect(screen).toMatchSnapshot()
  })

  it('should call logout routine when clicking the logout button', async () => {
    await renderProfileLoggedIn({ user: beneficiaryUser })

    const logoutButton = await screen.findByText('Déconnexion')
    await user.press(logoutButton)

    expect(logoutRoutineMock).toHaveBeenCalledTimes(1)
  })
})

const renderProfileLoggedIn = async ({ user }: { user: typeof beneficiaryUser }) => {
  const renderResult = render(
    reactQueryProviderHOC(
      <ProfileLoggedIn
        featureFlags={{
          enablePassForAll: true,
          enableProfileV2: true,
          disableActivation: false,
        }}
        user={user}
      />
    )
  )
  await screen.findByTestId('profile-logged-in')
  return renderResult
}
