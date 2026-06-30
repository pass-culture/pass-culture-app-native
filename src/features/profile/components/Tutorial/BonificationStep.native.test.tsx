import React from 'react'

import { BonificationStep } from 'features/profile/components/Tutorial/BonificationStep'
import { beneficiaryUser } from 'fixtures/user'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

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
    renderBonificationStep()

    expect(screen.queryByText('Bonus sous conditions')).not.toBeOnTheScreen()
  })

  it('should render family quotient step only when family quotient bonification is enabled', () => {
    renderBonificationStep({ enableFamilyQuotientBonification: true })

    expect(screen.getByText('Le bonus dépend des ressources de ton foyer.')).toBeOnTheScreen()

    expect(
      screen.queryByText('Le bonus est réservé aux jeunes touchant l’AEEH ou l’AAH.')
    ).not.toBeOnTheScreen()
  })

  it('should render handicap step only when handicap bonification is enabled', () => {
    renderBonificationStep({ enableHandicapBonification: true })

    expect(
      screen.getByText('Le bonus est réservé aux jeunes touchant l’AEEH ou l’AAH.')
    ).toBeOnTheScreen()

    expect(screen.queryByText('Le bonus dépend des ressources de ton foyer.')).not.toBeOnTheScreen()
  })

  it('should render combined step when both bonifications are enabled', () => {
    renderBonificationStep({
      enableHandicapBonification: true,
      enableFamilyQuotientBonification: true,
    })

    expect(screen.getByText('Tu ne peux pas cumuler les deux bonus')).toBeOnTheScreen()

    expect(
      screen.getByText('Le bonus est réservé aux jeunes touchant l’AEEH ou l’AAH.')
    ).toBeOnTheScreen()

    expect(screen.getByText('Le bonus dépend des ressources de ton foyer.')).toBeOnTheScreen()
  })
})

const renderBonificationStep = (
  props: Partial<React.ComponentProps<typeof BonificationStep>> = {}
) => {
  return render(reactQueryProviderHOC(<BonificationStep {...defaultProps} {...props} />))
}
