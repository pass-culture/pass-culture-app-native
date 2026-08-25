import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SuspendProfileAccountHacked } from 'features/profile/pages/SuspendProfile/SuspendProfileAccountHacked'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('SuspendProfileAccountHacked', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    render(<SuspendProfileAccountHacked />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to profile on press ne pas sécuriser mon compte', async () => {
    render(<SuspendProfileAccountHacked />)
    const button = screen.getByText('Ne pas sécuriser mon compte')

    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Profile' })
  })

  it('should navigate to confirm delete profile on press Susprendre mon compte', async () => {
    render(<SuspendProfileAccountHacked />)
    const button = screen.getByText('Suspendre mon compte')

    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'SuspendAccountConfirmationWithoutAuthentication',
    })
  })
})
