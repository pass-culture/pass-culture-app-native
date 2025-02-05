import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockSettings } from 'features/auth/context/mockSettings'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { userEvent, render, screen } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()
mockSettings()

describe('SignupBanner', () => {
  beforeEach(() => setFeatureFlags())

  it('should display banner with credit V2 subtitle', () => {
    render(<SignupBanner hasGraphicRedesign={false} />)

    const subtitle = 'Crée ton compte si tu as entre 15 et 18 ans\u00a0!'

    expect(screen.getByText(subtitle)).toBeOnTheScreen()
  })

  describe('when wipAppV2SystemBlock deactivated', () => {
    it('should display banner with background', () => {
      render(<SignupBanner hasGraphicRedesign={false} />)

      expect(screen.getByTestId('bannerWithBackground')).toBeOnTheScreen()
    })

    it('should not display system banner', () => {
      render(<SignupBanner hasGraphicRedesign={false} />)

      expect(screen.queryByTestId('systemBanner')).not.toBeOnTheScreen()
    })

    it('should redirect to signup form on press', async () => {
      render(<SignupBanner hasGraphicRedesign={false} />)

      await user.press(screen.getByText('Débloque ton crédit'))

      expect(navigate).toHaveBeenCalledWith('SignupForm', { from: StepperOrigin.HOME })
    })

    it('should log analytics on press', async () => {
      render(<SignupBanner hasGraphicRedesign={false} />)

      await user.press(screen.getByText('Débloque ton crédit'))

      expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'home' })
    })
  })

  describe('when wipAppV2SystemBlock activated', () => {
    beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK]))

    it('should not display banner with background', () => {
      render(<SignupBanner hasGraphicRedesign />)

      expect(screen.queryByTestId('bannerWithBackground')).not.toBeOnTheScreen()
    })

    it('should not  system banner', () => {
      render(<SignupBanner hasGraphicRedesign />)

      expect(screen.getByTestId('systemBanner')).toBeOnTheScreen()
    })

    it('should redirect to signup form on press', async () => {
      render(<SignupBanner hasGraphicRedesign />)

      await user.press(screen.getByText('Débloque ton crédit'))

      expect(navigate).toHaveBeenCalledWith('SignupForm', { from: StepperOrigin.HOME })
    })

    it('should log analytics on press', async () => {
      render(<SignupBanner hasGraphicRedesign />)

      await user.press(screen.getByText('Débloque ton crédit'))

      expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'home' })
    })
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => {
      mockSettings({ wipEnableCreditV3: true })
    })

    it('should display banner with credit V3 subtitle', () => {
      render(<SignupBanner hasGraphicRedesign={false} />)

      const subtitle = 'Crée ton compte si tu as 17 ou 18 ans\u00a0!'

      expect(screen.getByText(subtitle)).toBeOnTheScreen()
    })
  })
})
