import React from 'react'

import { DMSModal } from 'features/identityCheck/components/DMSModal'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { fireEvent, render } from 'tests/utils'

const hideModalMock = jest.fn()
jest.mock('features/auth/settings')
jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

describe('<DMSModal/>', () => {
  it('should call hideModal function when clicking on ArrowPrevious icon', () => {
    const { getByTestId } = render(<DMSModal visible={true} hideModal={hideModalMock} />)
    const leftIcon = getByTestId('Revenir en arrière')
    fireEvent.press(leftIcon)
    expect(hideModalMock).toHaveBeenCalled()
  })

  it('should open DSM french citizen when clicking on "Je suis de nationalité française" button', () => {
    const { getByText } = render(<DMSModal visible={true} hideModal={hideModalMock} />)
    const frenchCitizenDMSButton = getByText('Je suis de nationalité française')
    fireEvent.press(frenchCitizenDMSButton)
    expect(mockedOpenUrl).toBeCalledWith(env.DMS_FRENCH_CITIZEN_URL)
  })

  it('should open DSM french citizen when clicking on "Je suis de nationalité étrangère" button', () => {
    const { getByText } = render(<DMSModal visible={true} hideModal={hideModalMock} />)
    const foreignCitizenDMSButton = getByText('Je suis de nationalité étrangère')
    fireEvent.press(foreignCitizenDMSButton)
    expect(mockedOpenUrl).toBeCalledWith(env.DMS_FOREIGN_CITIZEN_URL)
  })
})
