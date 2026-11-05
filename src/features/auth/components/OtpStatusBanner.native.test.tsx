import React from 'react'

import { OtpStatusBanner } from 'features/auth/components/OtpStatusBanner'
import { formatRemainingTime } from 'shared/times/formatRemainingTime'
import { render, screen } from 'tests/utils'

const defaultProps = { isAccountLocked: false, remainingSeconds: 3600 }

jest.mock('shared/times/formatRemainingTime', () => ({
  formatRemainingTime: jest.fn(() => '1 heure'),
}))

describe('<OtpStatusBanner />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(formatRemainingTime).mockReturnValue('1 heure')
  })

  it('should not render a banner when no status is active', () => {
    const { toJSON } = render(<OtpStatusBanner {...defaultProps} />)

    expect(toJSON()).toBeNull()
  })

  describe('when the account is locked', () => {
    it('should display the email and remaining suspension time', () => {
      render(<OtpStatusBanner {...defaultProps} isAccountLocked email="tes***@gmail.com" />)

      expect(
        screen.getByText('Le compte tes***@gmail.com est temporairement inaccessible.')
      ).toBeOnTheScreen()
      expect(
        screen.getByText('Un peu de patience, tu pourras te reconnecter dans 1 heure.')
      ).toBeOnTheScreen()
      expect(formatRemainingTime).toHaveBeenCalledWith(3600)
    })

    it('should display a generic message when no email is provided', () => {
      render(<OtpStatusBanner {...defaultProps} isAccountLocked />)

      expect(screen.getByText('Ce compte est temporairement inaccessible.')).toBeOnTheScreen()
    })

    it('should take priority over the expired-code status', () => {
      render(<OtpStatusBanner {...defaultProps} isAccountLocked isCodeExpired />)

      expect(screen.getByText('Ce compte est temporairement inaccessible.')).toBeOnTheScreen()
      expect(
        screen.queryByText('Ce code a expiré, demandes-en un nouveau pour continuer.')
      ).not.toBeOnTheScreen()
    })
  })

  describe('when the code has expired', () => {
    it('should display the expiration message', () => {
      render(<OtpStatusBanner {...defaultProps} isCodeExpired />)

      expect(
        screen.getByText('Ce code a expiré, demandes-en un nouveau pour continuer.')
      ).toBeOnTheScreen()
    })

    it('should take priority over the last-attempt status', () => {
      render(<OtpStatusBanner {...defaultProps} isCodeExpired isLastAttempt />)

      expect(
        screen.getByText('Ce code a expiré, demandes-en un nouveau pour continuer.')
      ).toBeOnTheScreen()
      expect(screen.queryByText('Attention, il ne te reste qu’un essai.')).not.toBeOnTheScreen()
    })
  })

  describe('when only one attempt remains', () => {
    it('should display the warning message', () => {
      render(<OtpStatusBanner {...defaultProps} isLastAttempt />)

      expect(screen.getByText('Attention, il ne te reste qu’un essai.')).toBeOnTheScreen()
      expect(
        screen.getByText(
          'Si tu saisis un nouveau code incorrect, ton compte sera temporairement suspendu pendant 1 heure.'
        )
      ).toBeOnTheScreen()
    })
  })

  describe('when a new code has been sent', () => {
    it('should display the confirmation and resend countdown', () => {
      render(<OtpStatusBanner {...defaultProps} isNewCodeSent resendCountdown={120} />)

      expect(screen.getByText('Un nouveau code t’a été envoyé.')).toBeOnTheScreen()
      expect(screen.getByText(/Tu pourras demander un nouveau code dans/)).toBeOnTheScreen()
      expect(screen.getByText('1 heure')).toBeOnTheScreen()
      expect(formatRemainingTime).toHaveBeenCalledWith(120)
    })
  })

  describe('when the last attempt and a new code sent statuses are active', () => {
    it('should display both the warning and the new-code confirmation', () => {
      render(
        <OtpStatusBanner {...defaultProps} isLastAttempt isNewCodeSent resendCountdown={120} />
      )

      expect(screen.getByText('Attention, il ne te reste qu’un essai.')).toBeOnTheScreen()
      expect(screen.getByText('Un nouveau code t’a été envoyé.')).toBeOnTheScreen()
      expect(screen.getByText(/Tu pourras demander un nouveau code dans/)).toBeOnTheScreen()
      expect(formatRemainingTime).toHaveBeenCalledWith(120)
    })
  })
})
