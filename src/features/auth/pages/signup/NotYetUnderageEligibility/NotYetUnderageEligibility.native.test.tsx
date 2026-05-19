import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { render, screen, userEvent } from 'tests/utils'

import { NotYetUnderageEligibility } from './NotYetUnderageEligibility'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

const navigationProps = {
  route: { params: { eligibilityStartDatetime: '2019-12-01T00:00:00Z' } },
} as NativeStackScreenProps<RootStackParamList, 'NotYetUnderageEligibility'>

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<NotYetUnderageEligibility />', () => {
  it('should render properly', () => {
    render(<NotYetUnderageEligibility {...navigationProps} />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    render(<NotYetUnderageEligibility {...navigationProps} />)

    const button = screen.getByText('Retourner à l’accueil')
    await user.press(button)

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
