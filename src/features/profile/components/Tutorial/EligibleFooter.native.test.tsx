import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EligibleFooter } from 'features/profile/components/Tutorial/EligibleFooter'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()

describe('<EligibleFooter />', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should display correct deposit for 17 years old', () => {
    render(<EligibleFooter age={17} />)

    expect(
      screen.getByText('Vérifie ton identité et active tes 50 € de crédit dès maintenant !')
    ).toBeOnTheScreen()
  })

  it('should display correct deposit for 18 years old', () => {
    render(<EligibleFooter age={18} />)

    expect(
      screen.getByText('Vérifie ton identité et active tes 150 € de crédit dès maintenant !')
    ).toBeOnTheScreen()
  })

  it('should navigate to Stepper when user press "Activer mon crédit"', async () => {
    render(<EligibleFooter age={18} />)

    await user.press(screen.getByText('Activer mon crédit'))

    expect(navigate).toHaveBeenCalledWith('Stepper', { from: 'Tutorial' })
  })
})
