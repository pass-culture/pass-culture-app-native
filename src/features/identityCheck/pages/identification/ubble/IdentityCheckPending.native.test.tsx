import React from 'react'

import { IdentityCheckPending } from 'features/identityCheck/pages/identification/ubble/IdentityCheckPending'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

describe('<IdentityCheckPending/>', () => {
  it('should render correctly', () => {
    render(<IdentityCheckPending />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to next screen after timeout', () => {
    render(<IdentityCheckPending />)

    fireEvent.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toHaveBeenNthCalledWith(
      1,
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
