import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { render, fireEvent, screen } from 'tests/utils'

import { NotYetUnderageEligibility } from './NotYetUnderageEligibility'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

const navigationProps = {
  route: { params: { eligibilityStartDatetime: '2019-12-01T00:00:00Z' } },
} as StackScreenProps<RootStackParamList, 'NotYetUnderageEligibility'>

describe('<NotYetUnderageEligibility />', () => {
  it('should render properly', () => {
    render(<NotYetUnderageEligibility {...navigationProps} />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page WHEN go back to home button is clicked', () => {
    render(<NotYetUnderageEligibility {...navigationProps} />)

    const button = screen.getByText('Retourner à l’accueil')
    fireEvent.press(button)

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
