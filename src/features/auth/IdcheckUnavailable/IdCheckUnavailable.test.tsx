import React from 'react'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent } from 'tests/utils'

import { IdCheckUnavailable } from './IdCheckUnavailable'

jest.mock('features/auth/settings')
jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

describe('<IdCheckUnavailable/>', () => {
  it('should open DSM on click', () => {
    const { getByText } = renderIdCheckUnavailable()

    fireEvent.press(getByText(`Transmettre un dossier`))
    expect(mockedOpenUrl).toBeCalledWith(env.DSM_URL)
  })

  it('should go back WHEN go back is clicked', () => {
    const { getByText } = renderIdCheckUnavailable()

    fireEvent.press(getByText(`Retourner à l'accueil`))
    expect(mockGoBack).toBeCalledTimes(1)
  })
})

function renderIdCheckUnavailable() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<IdCheckUnavailable />))
}
