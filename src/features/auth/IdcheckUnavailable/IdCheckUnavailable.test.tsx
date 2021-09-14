import React from 'react'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import * as NavigationHelpers from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent } from 'tests/utils'

import { IdCheckUnavailable } from './IdCheckUnavailable'

jest.mock('features/auth/settings')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('<IdCheckUnavailable/>', () => {
  it('should open DSM on click', () => {
    const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
    const { getByText } = renderIdCheckUnavailable()

    fireEvent.press(getByText(`Transmettre un dossier`))
    expect(openExternalUrl).toBeCalledWith(env.DSM_URL)
  })

  it('should go back WHEN go back is clicked', () => {
    const { getByText } = renderIdCheckUnavailable()

    fireEvent.press(getByText(`Retour`))
    expect(mockGoBack).toBeCalledTimes(1)
  })
})

function renderIdCheckUnavailable() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<IdCheckUnavailable />))
}
