import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment/env'
import { fireEvent, render, screen } from 'tests/utils'

import { SuspensionChoice } from './SuspensionChoice'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<SuspensionChoice/>', () => {
  it('should match snapshot', () => {
    render(<SuspensionChoice />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to suspension confirmation screen when clicking on "Oui, suspendre mon compte" button', () => {
    render(<SuspensionChoice />)

    const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')
    fireEvent.press(acceptSuspensionButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SuspiciousLoginSuspendedAccount')
  })

  it('should open mail app when clicking on "Contacter le support" button', () => {
    render(<SuspensionChoice />)

    const contactSupportButton = screen.getByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    expect(openUrl).toBeCalledWith(
      contactSupport.forGenericQuestion.url,
      contactSupport.forGenericQuestion.params,
      true
    )
  })

  it('should open CGU url when clicking on "conditions générales d’utilisation" button', () => {
    render(<SuspensionChoice />)

    const cguButton = screen.getByText('conditions générales d’utilisation')
    fireEvent.press(cguButton)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.CGU_LINK, undefined, true)
  })
})
