import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { setSettings } from 'features/auth/tests/setSettings'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { userEvent, render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('SignupBanner', () => {
  beforeEach(() => setFeatureFlags())

  it('should display banner with credit V2 subtitle', () => {
    render(<SignupBanner />)

    const subtitle = 'Crée ton compte si tu as entre 15 et 18 ans\u00a0!'

    expect(screen.getByText(subtitle)).toBeOnTheScreen()
  })

  it('should redirect to signup form on press', async () => {
    render(<SignupBanner />)

    await user.press(screen.getByText('Débloque ton crédit'))

    expect(navigate).toHaveBeenCalledWith('SignupForm', { from: StepperOrigin.HOME })
  })

  it('should log analytics on press', async () => {
    render(<SignupBanner />)

    await user.press(screen.getByText('Débloque ton crédit'))

    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'home' })
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => {
      setSettings({ wipEnableCreditV3: true })
    })

    it('should display banner with credit V3 subtitle', () => {
      render(<SignupBanner />)

      const subtitle = 'Crée ton compte si tu as 17 ou 18 ans\u00a0!'

      expect(screen.getByText(subtitle)).toBeOnTheScreen()
    })
  })
})
