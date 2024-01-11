import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

describe('SignupBanner', () => {
  it('should redirect to signup form on press', async () => {
    render(<SignupBanner />)

    fireEvent.press(screen.getByText('Débloque ton crédit'))

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('SignupForm', { from: StepperOrigin.HOME })
    )
  })

  it('should log analytics on press', async () => {
    render(<SignupBanner />)

    fireEvent.press(screen.getByText('Débloque ton crédit'))

    await waitFor(() =>
      expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'home' })
    )
  })
})
