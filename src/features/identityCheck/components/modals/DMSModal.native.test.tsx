import React from 'react'

import { DMSModal } from 'features/identityCheck/components/modals/DMSModal'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { render, screen, userEvent } from 'tests/utils'

const hideModalMock = jest.fn()

jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<DMSModal/>', () => {
  it('should render correctly', () => {
    render(<DMSModal visible hideModal={hideModalMock} />)

    expect(screen).toMatchSnapshot()
  })

  it('should call hideModal function when clicking on Close icon', async () => {
    render(<DMSModal visible hideModal={hideModalMock} />)
    const rightIcon = screen.getByTestId(
      'Fermer la modale pour transmettre un document sur le site Démarche Numérique'
    )
    await user.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should open DSM french citizen when clicking on "Je suis de nationalité française" button', async () => {
    render(<DMSModal visible hideModal={hideModalMock} />)
    const frenchCitizenDMSButton = screen.getByText('Je suis de nationalité française')
    await user.press(frenchCitizenDMSButton)

    expect(mockedOpenUrl).toHaveBeenCalledWith(env.DMS_FRENCH_CITIZEN_URL, undefined, true)
  })

  it('should open DSM foreign citizen when clicking on "Je suis de nationalité étrangère" button', async () => {
    render(<DMSModal visible hideModal={hideModalMock} />)
    const foreignCitizenDMSButton = screen.getByText('Je suis de nationalité étrangère')
    await user.press(foreignCitizenDMSButton)

    expect(mockedOpenUrl).toHaveBeenCalledWith(env.DMS_FOREIGN_CITIZEN_URL, undefined, true)
  })

  describe('analytics', () => {
    it.each`
      buttonText                            | analytic
      ${'Je suis de nationalité française'} | ${analytics.logOpenDMSFrenchCitizenURL}
      ${'Je suis de nationalité étrangère'} | ${analytics.logOpenDMSForeignCitizenURL}
    `('should $analytic when clicking on $buttonText', async ({ buttonText, analytic }) => {
      render(<DMSModal visible hideModal={hideModalMock} />)
      await user.press(screen.getByText(buttonText))

      expect(analytic).toHaveBeenCalledTimes(1)
    })
  })
})
