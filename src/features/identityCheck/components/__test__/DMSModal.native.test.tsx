import React from 'react'

import { DMSModal } from 'features/identityCheck/components/DMSModal'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { fireEvent, render } from 'tests/utils'

const hideModalMock = jest.fn()
jest.mock('features/auth/settings')
jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

describe('<DMSModal/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<DMSModal visible={true} hideModal={hideModalMock} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    const { getByTestId } = render(<DMSModal visible={true} hideModal={hideModalMock} />)
    const rightIcon = getByTestId(
      'Fermer la modale pour transmettre un document sur le site Démarches Simplifiée'
    )
    fireEvent.press(rightIcon)
    expect(hideModalMock).toHaveBeenCalled()
  })

  it('should open DSM french citizen when clicking on "Je suis de nationalité française" button', () => {
    const { getByText } = render(<DMSModal visible={true} hideModal={hideModalMock} />)
    const frenchCitizenDMSButton = getByText('Je suis de nationalité française')
    fireEvent.press(frenchCitizenDMSButton)
    expect(analytics.logOpenDMSFrenchCitizenURL).toHaveBeenCalledTimes(1)
    expect(mockedOpenUrl).toBeCalledWith(env.DMS_FRENCH_CITIZEN_URL)
  })

  it('should open DSM french citizen when clicking on "Je suis de nationalité étrangère" button', () => {
    const { getByText } = render(<DMSModal visible={true} hideModal={hideModalMock} />)
    const foreignCitizenDMSButton = getByText('Je suis de nationalité étrangère')
    fireEvent.press(foreignCitizenDMSButton)
    expect(analytics.logOpenDMSForeignCitizenURL).toHaveBeenCalledTimes(1)
    expect(mockedOpenUrl).toBeCalledWith(env.DMS_FOREIGN_CITIZEN_URL)
  })
})
