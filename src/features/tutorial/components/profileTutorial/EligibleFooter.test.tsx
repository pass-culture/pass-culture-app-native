import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EligibleFooter } from 'features/tutorial/components/profileTutorial/EligibleFooter'
import { fireEvent, render, screen } from 'tests/utils'

describe('<EligibleFooter />', () => {
  it('should display correct deposit for 15 years old', () => {
    render(<EligibleFooter age={15} />)

    expect(
      screen.getByText('Vérifie ton identité et active tes 20 € de crédit dès maintenant\u00a0!')
    ).toBeOnTheScreen()
  })

  it('should display correct deposit for 18 years old', () => {
    render(<EligibleFooter age={18} />)

    expect(
      screen.getByText('Vérifie ton identité et active tes 300 € de crédit dès maintenant\u00a0!')
    ).toBeOnTheScreen()
  })

  it('should navigate to VerifyEligibility when user press "Activer mon crédit"', () => {
    render(<EligibleFooter age={18} />)

    fireEvent.press(screen.getByText('Activer mon crédit'))

    expect(navigate).toHaveBeenCalledWith('Stepper')
  })
})
