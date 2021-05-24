import React from 'react'

import * as NativeHelpers from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent } from 'tests/utils'

import { IdCheckUnavailable } from './IdCheckUnavailable'

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
    const canGoBack = jest.spyOn(NativeHelpers, 'canGoBack').mockReturnValue(true)
    const goBack = jest.spyOn(NativeHelpers, 'goBack')

    const { getByText } = renderIdCheckUnavailable()

    fireEvent.press(getByText(`Retour`))
    expect(canGoBack).toBeCalledTimes(1)
    expect(goBack).toBeCalledTimes(1)
  })
})

function renderIdCheckUnavailable() {
  return render(reactQueryProviderHOC(<IdCheckUnavailable />))
}
