import React from 'react'

import { DMSModal } from 'features/identityCheck/components/modals/DMSModal'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { fireEvent, render, screen } from 'tests/utils'

const hideModalMock = jest.fn()

jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

describe('<DMSModal/>', () => {
  it('should render correctly', () => {
    render(<DMSModal visible hideModal={hideModalMock} />)
    expect(screen).toMatchSnapshot()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    render(<DMSModal visible hideModal={hideModalMock} />)
    const rightIcon = screen.getByTestId(
      'Fermer la modale pour transmettre un document sur le site Démarches Simplifiée'
    )
    fireEvent.press(rightIcon)
    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should open DSM french citizen when clicking on "Je suis de nationalité française" button', async () => {
    render(<DMSModal visible hideModal={hideModalMock} />)
    const frenchCitizenDMSButton = screen.getByText('Je suis de nationalité française')
    await fireEvent.press(frenchCitizenDMSButton)
    expect(analytics.logOpenDMSFrenchCitizenURL).toHaveBeenCalledTimes(1)
    expect(mockedOpenUrl).toBeCalledWith(env.DMS_FRENCH_CITIZEN_URL, undefined, true)
  })

  it('should open DSM french citizen when clicking on "Je suis de nationalité étrangère" button', async () => {
    render(<DMSModal visible hideModal={hideModalMock} />)
    const foreignCitizenDMSButton = screen.getByText('Je suis de nationalité étrangère')
    await fireEvent.press(foreignCitizenDMSButton)
    expect(analytics.logOpenDMSForeignCitizenURL).toHaveBeenCalledTimes(1)
    expect(mockedOpenUrl).toBeCalledWith(env.DMS_FOREIGN_CITIZEN_URL, undefined, true)
  })
})
