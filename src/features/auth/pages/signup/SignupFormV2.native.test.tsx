import React from 'react'

import { SignupForm } from 'features/auth/pages/signup/SignupFormV2'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { analytics } from 'libs/analytics'
import { act, fireEvent, render, screen } from 'tests/utils'

describe('Signup Form', () => {
  it('should match snapshot', async () => {
    render(<SignupForm />)

    //TODO(PC-22282) use await screen.findByTestId('Continuer vers l’étape Mot de passe') when SetEmail is implemented
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })
  it('should not display quit button on firstStep', async () => {
    render(<SignupForm />)

    //TODO(PC-22282) use await screen.findByTestId('Continuer vers l’étape Mot de passe') when SetEmail is implemented
    await act(async () => {})

    const icon = screen.queryByText('Annuler')
    expect(icon).toBeNull()
  })

  it('should call goBack() when left icon is pressed from first step', async () => {
    render(<SignupForm />)

    const icon = await screen.findByTestId('Revenir en arrière')
    fireEvent.press(icon)

    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should log analytics when clicking on close icon', async () => {
    render(<SignupForm />)

    //TODO(PC-22282) use await screen.findByTestId('Continuer vers l’étape Mot de passe') when SetEmail is implemented
    fireEvent.press(await screen.findByText('Next Step'))
    fireEvent.press(screen.getByText('Annuler'))

    expect(analytics.logQuitSignup).toHaveBeenNthCalledWith(1, 'SetPassword')
  })
})
