import React from 'react'

import * as useOneTimePasswordAttemptsModule from 'features/auth/helpers/useOneTimePasswordAttempts'
import * as formatRemainingTimeModule from 'shared/times/formatRemainingTime'
import { render, screen } from 'tests/utils'

import { OneTimePasswordLimit } from './OneTimePasswordLimit'

jest.spyOn(useOneTimePasswordAttemptsModule, 'useOneTimePasswordAttempts').mockReturnValue({
  remainingSeconds: 3600,
  failedAttempts: 0,
  codeError: undefined,
  hasReachedMaxCodeAttempts: false,
  loginEmail: null,
  saveLoginEmail: jest.fn(),
  registerFailedAttempt: jest.fn(),
  clearCodeError: jest.fn(),
  isLastAttempt: false,
  maxCodeAttempts: 0,
})

jest.spyOn(formatRemainingTimeModule, 'formatRemainingTime').mockReturnValue('1 heure')

describe('<OneTimePasswordLimit />', () => {
  it('should render correctly', async () => {
    render(<OneTimePasswordLimit />)

    expect(await screen.findByText('Limite d’essais atteinte')).toBeOnTheScreen()

    expect(screen).toMatchSnapshot()
  })

  it('should display the suspension message', () => {
    render(<OneTimePasswordLimit />)

    expect(
      screen.getByText(
        /Tu as saisi plusieurs codes incorrects d’affilée\. Par mesure de sécurité, l’accès à ton compte est suspendu pendant/
      )
    ).toBeOnTheScreen()
  })

  it('should display the remaining suspension time', () => {
    render(<OneTimePasswordLimit />)

    expect(screen.getByText('1 heure.')).toBeOnTheScreen()

    expect(formatRemainingTimeModule.formatRemainingTime).toHaveBeenCalledWith(3600)
  })

  it('should display the login and home buttons', () => {
    render(<OneTimePasswordLimit />)

    expect(screen.getByText('Retourner à la connexion')).toBeOnTheScreen()
    expect(screen.getByText('Aller à l’accueil')).toBeOnTheScreen()
  })
})
