import React from 'react'

import { ExpiredOrLostID } from 'features/identityCheck/pages/identification/identificationStart/ExpiredOrLostID'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/navigationRef')

describe('ExpiredOrLostID', () => {
  it('should render correctly', () => {
    const ExpiredOrLostIDPage = render(<ExpiredOrLostID />)
    expect(ExpiredOrLostIDPage).toMatchSnapshot()
  })

  it('should navigate to home on press "M\'identifier plus tard"', () => {
    const { getByText } = render(<ExpiredOrLostID />)

    const button = getByText('M’identifier plus tard')
    fireEvent.press(button)
    expect(navigateFromRef).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
})
