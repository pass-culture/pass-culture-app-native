import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { QFBonificationStatus } from 'api/gen'
import { BonificationRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { BonificationStep } from 'features/profile/components/Tutorial/BonificationStep'
import { beneficiaryUser } from 'fixtures/user'
import { render, screen, userEvent } from 'tests/utils'

const defaultProps = {
  amount: '50€',
  isLoggedIn: true,
  resetBannerVisibility: jest.fn(),
  user: beneficiaryUser,
  enableHandicapBonification: false,
  enableFamilyQuotientBonification: false,
}

describe('<BonificationStep />', () => {
  it('should render nothing if all bonifications are disabled', () => {
    render(<BonificationStep {...defaultProps} />)

    expect(screen.queryByText('Bonus sous conditions')).not.toBeOnTheScreen()
  })

  it('should render family quotient step only when family quotient bonification is enabled', () => {
    render(<BonificationStep {...defaultProps} enableFamilyQuotientBonification />)

    expect(screen.getByText('Le bonus dépend des ressources de ton foyer.')).toBeOnTheScreen()

    expect(
      screen.queryByText('Le bonus est réservé aux jeunes touchant l’AEEH ou l’AAH.')
    ).not.toBeOnTheScreen()
  })

  it('should render handicap step only when handicap bonification is enabled', () => {
    render(<BonificationStep {...defaultProps} enableHandicapBonification />)

    expect(
      screen.getByText('Le bonus est réservé aux jeunes touchant l’AEEH ou l’AAH.')
    ).toBeOnTheScreen()

    expect(screen.queryByText('Le bonus dépend des ressources de ton foyer.')).not.toBeOnTheScreen()
  })

  it('should render combined step when both bonifications are enabled', () => {
    render(
      <BonificationStep
        {...defaultProps}
        enableHandicapBonification
        enableFamilyQuotientBonification
      />
    )

    expect(screen.getByText('Tu ne peux pas cumuler les deux bonus')).toBeOnTheScreen()

    expect(
      screen.getByText('Le bonus est réservé aux jeunes touchant l’AEEH ou l’AAH.')
    ).toBeOnTheScreen()

    expect(screen.getByText('Le bonus dépend des ressources de ton foyer.')).toBeOnTheScreen()
  })

  it('should navigate to bonification explanations when bonification is eligible', async () => {
    render(
      <BonificationStep
        {...defaultProps}
        enableFamilyQuotientBonification
        user={{ ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.eligible }}
      />
    )

    const button = screen.getByText('Vérifier maintenant')

    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationExplanations',
    })
  })

  it('should navigate to bonification refused screen when user has no remaining attempts', async () => {
    render(
      <BonificationStep
        {...defaultProps}
        enableFamilyQuotientBonification
        user={{
          ...beneficiaryUser,
          qfBonificationStatus: QFBonificationStatus.eligible,
          remainingBonusAttempts: 0,
        }}
      />
    )

    const button = screen.getByText('Vérifier maintenant')

    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: { bonificationRefusedType: BonificationRefusedType.TOO_MANY_RETRIES },
      screen: 'BonificationRefused',
    })
  })

  it('should disable button when request is started', () => {
    render(
      <BonificationStep
        {...defaultProps}
        enableFamilyQuotientBonification
        user={{ ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.started }}
      />
    )

    const button = screen.getByText('En cours de traitement')

    expect(button).toBeDisabled()
  })

  it('should hide button if user is not eligible', () => {
    render(
      <BonificationStep
        {...defaultProps}
        enableFamilyQuotientBonification
        user={{ ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.not_eligible }}
      />
    )

    expect(screen.queryByText('Vérifier maintenant')).not.toBeOnTheScreen()
  })

  it('should hide button if bonus already granted when bonification granted', () => {
    render(
      <BonificationStep
        {...defaultProps}
        enableFamilyQuotientBonification
        user={{ ...beneficiaryUser, qfBonificationStatus: QFBonificationStatus.granted }}
      />
    )

    expect(screen.queryByText('Vérifier maintenant')).not.toBeOnTheScreen()
  })
})
