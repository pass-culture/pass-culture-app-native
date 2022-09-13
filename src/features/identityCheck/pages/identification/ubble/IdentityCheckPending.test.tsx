import React from 'react'
import waitForExpect from 'wait-for-expect'

import { IdentityCheckPending } from 'features/identityCheck/pages/identification/ubble/IdentityCheckPending'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

describe('<IdentityCheckPending/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckPending />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to next screen after timeout', async () => {
    const { getByText } = render(<IdentityCheckPending />)
    fireEvent.press(getByText(`Retourner à l'accueil`))
    await waitForExpect(() => {
      expect(navigateFromRef).toBeCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })
})
