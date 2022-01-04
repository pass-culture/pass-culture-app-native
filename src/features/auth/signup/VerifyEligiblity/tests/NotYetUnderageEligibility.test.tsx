import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { render, fireEvent } from 'tests/utils'

import { NotYetUnderageEligibility } from '../NotYetUnderageEligibility'

jest.mock('features/navigation/helpers')

const navigationProps = {
  route: { params: { eligibilityStartDatetime: '2019-12-01T00:00:00Z' } },
} as StackScreenProps<RootStackParamList, 'NotYetUnderageEligibility'>

describe('<NotYetUnderageEligibility />', () => {
  it('should render properly', async () => {
    const NotYetUnderageEligibilityComponent = render(
      <NotYetUnderageEligibility {...navigationProps} />
    )
    expect(NotYetUnderageEligibilityComponent).toMatchSnapshot()
  })

  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    const { findByText } = render(<NotYetUnderageEligibility {...navigationProps} />)

    const button = await findByText("Retourner à l'accueil")
    fireEvent.press(button)

    expect(navigateToHome).toBeCalled()
  })
})
