import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { SuspensionChoice } from './SuspensionChoice'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

describe('<SuspensionChoice/>', () => {
  it('should match snapshot', () => {
    renderSuspensionChoice()

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to suspension confirmation screen when clicking on "Oui, suspendre mon compte" button is success', async () => {
    simulateSuspendForSuspiciousLoginSuccess()
    renderSuspensionChoice()

    const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')
    fireEvent.press(acceptSuspensionButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SuspiciousLoginSuspendedAccount')
    })
  })

  it('should show snackbar when clicking on "Oui, suspendre mon compte" button with is error', async () => {
    simulateSuspendForSuspiciousLoginError()
    renderSuspensionChoice()

    const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')
    fireEvent.press(acceptSuspensionButton)

    await waitFor(() => {
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message:
          'Une erreur est survenue. Pour suspendre ton compte, contacte le support par e-mail.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should open mail app when clicking on "Contacter le support" button', () => {
    renderSuspensionChoice()

    const contactSupportButton = screen.getByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    expect(openUrl).toBeCalledWith(
      contactSupport.forGenericQuestion.url,
      contactSupport.forGenericQuestion.params,
      true
    )
  })

  it('should open CGU url when clicking on "conditions générales d’utilisation" button', () => {
    renderSuspensionChoice()

    const cguButton = screen.getByText('conditions générales d’utilisation')
    fireEvent.press(cguButton)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.CGU_LINK, undefined, true)
  })
})

function renderSuspensionChoice() {
  return render(<SuspensionChoice />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}

function simulateSuspendForSuspiciousLoginSuccess() {
  server.use(
    rest.post(
      env.API_BASE_URL + '/native/v1/account/suspend_for_suspicious_login',
      async (_, res, ctx) => res(ctx.status(200))
    )
  )
}

function simulateSuspendForSuspiciousLoginError() {
  server.use(
    rest.post(
      env.API_BASE_URL + '/native/v1/account/suspend_for_suspicious_login',
      async (_, res, ctx) => res(ctx.status(400))
    )
  )
}
