import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

describe('SignupBanner', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('When wipAppV2SystemBlock deactivated', () => {
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

      fireEvent.press(screen.getByText('Débloque ton crédit'))

      await waitFor(() =>
        expect(navigate).toHaveBeenCalledWith('SignupForm', { from: StepperOrigin.HOME })
      )
    })

    it('should log analytics on press', async () => {
      render(<SignupBanner hasGraphicRedesign={false} />)

      fireEvent.press(screen.getByText('Débloque ton crédit'))

      await waitFor(() =>
        expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'home' })
      )
    })
  })

  describe('When wipAppV2SystemBlock activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK])
    })

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

      fireEvent.press(screen.getByText('Débloque ton crédit'))

      await waitFor(() =>
        expect(navigate).toHaveBeenCalledWith('SignupForm', { from: StepperOrigin.HOME })
      )
    })

    it('should log analytics on press', async () => {
      render(<SignupBanner hasGraphicRedesign />)

      fireEvent.press(screen.getByText('Débloque ton crédit'))

      await waitFor(() =>
        expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'home' })
      )
    })
  })
})
