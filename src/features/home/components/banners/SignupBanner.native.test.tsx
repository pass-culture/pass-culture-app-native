import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { userEvent, render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('SignupBanner', () => {
  beforeEach(() => setFeatureFlags())

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
})
