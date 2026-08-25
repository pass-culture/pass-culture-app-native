import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as LogoutRoutine from 'features/auth/helpers/useLogoutRoutine'
import { SuspendProfileReason } from 'features/profile/pages/SuspendProfileReason/SuspendProfileReason'
import { nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

const signOutMock = jest.fn()
jest.spyOn(LogoutRoutine, 'useLogoutRoutine').mockReturnValue(signOutMock)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('features/auth/context/AuthContext')

const user = userEvent.setup()

jest.useFakeTimers()

describe('<SuspendProfileReason />', () => {
  beforeEach(() => {
    jest.setSystemTime(new Date('2020-01-01'))

    setFeatureFlags([RemoteStoreFeatureFlags.WIP_SUSPEND_PROFILE])
  })

  it('should match snapshot', () => {
    mockAuthContextWithUser(nonBeneficiaryUser)
    render(<SuspendProfileReason />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to DeleteProfileContactSupport page when clicking on "Autre" button', async () => {
    mockAuthContextWithUser(nonBeneficiaryUser)
    render(<SuspendProfileReason />)

    await user.press(screen.getByText('Autre'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'DeleteProfileContactSupport',
    })
  })

  it('should log analytics when clicking on reasonButton', async () => {
    mockAuthContextWithUser(nonBeneficiaryUser)
    render(<SuspendProfileReason />)

    await user.press(screen.getByText('Autre'))

    expect(analytics.logSelectSuspensionReason).toHaveBeenNthCalledWith(1, 'other')
  })

  it('should redirect to SuspendProfileAccountHacked page when clicking on reason', async () => {
    mockAuthContextWithUser(nonBeneficiaryUser)
    render(<SuspendProfileReason />)

    await user.press(screen.getByText('Je pense que quelqu’un d’autre a accès à mon compte'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'SuspendProfileAccountHacked',
    })
  })
})
