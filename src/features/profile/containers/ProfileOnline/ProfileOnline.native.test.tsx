import React from 'react'

import { ProfileOnline } from 'features/profile/containers/ProfileOnline/ProfileOnline'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, bottomScrollEvent, fireEvent, middleScrollEvent, render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/auth/context/AuthContext')

describe('<ProfileOnline />', () => {
  setFeatureFlags([
    RemoteStoreFeatureFlags.ENABLE_PROFILE_V2,
    RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL,
    RemoteStoreFeatureFlags.DISABLE_ACTIVATION,
  ])

  it('should display ProfileLoggedIn when user is logged in', async () => {
    mockAuthContextWithUser(beneficiaryUser)
    await renderProfileOnline()

    expect(await screen.findByTestId('profile-logged-in')).toBeOnTheScreen()
  })

  it('should display ProfileLoggedOut when user is logged out', async () => {
    mockAuthContextWithoutUser()
    await renderProfileOnline()

    expect(await screen.findByTestId('profile-logged-out')).toBeOnTheScreen()
  })

  it('should log ProfileScrolledToBottom analytics event when user scrolls to bottom', async () => {
    mockAuthContextWithUser(beneficiaryUser)
    await renderProfileOnline()

    const scrollContainer = screen.getByTestId('profile-scrollview')

    await act(async () => fireEvent.scroll(scrollContainer, middleScrollEvent))

    expect(analytics.logProfilScrolledToBottom).toHaveBeenCalledTimes(0)

    await act(async () => fireEvent.scroll(scrollContainer, bottomScrollEvent))

    expect(analytics.logProfilScrolledToBottom).toHaveBeenCalledTimes(1)
  })
})

const renderProfileOnline = async () => {
  const renderResult = render(reactQueryProviderHOC(<ProfileOnline />))
  await screen.findByTestId(/profile-logged/)
  return renderResult
}
