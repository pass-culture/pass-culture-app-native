import React from 'react'

import * as SettingsContextAPI from 'features/auth/context/SettingsContext'
import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { OnboardingTimeline } from 'features/tutorial/components/onboarding/OnboardingTimeline'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { render, screen } from 'tests/utils'

jest.mock('shared/user/useDepositAmountsByAge')
const mockUseDepositAmountsByAge = useDepositAmountsByAge as jest.Mock
mockUseDepositAmountsByAge.mockReturnValue({ eighteenYearsOldDeposit: '300 €' })

describe('OnboardingTimeline', () => {
  describe('when enableCreditV3 not activated', () => {
    beforeEach(() => setFeatureFlags())

    it('should display fifteen years old block', () => {
      render(<OnboardingTimeline age={15} />)

      const blockTitle = screen.getByText(`à 15 ans`)

      expect(blockTitle).toBeOnTheScreen()
    })

    it('should display sixteen years old block', () => {
      render(<OnboardingTimeline age={16} />)

      const blockTitle = screen.getByText(`à 16 ans`)

      expect(blockTitle).toBeOnTheScreen()
    })

    it('should display seventeen years old block', () => {
      render(<OnboardingTimeline age={17} />)

      const blockTitle = screen.getByText(`à 17 ans`)

      expect(blockTitle).toBeOnTheScreen()
    })

    it('should display eighteen years old block', () => {
      render(<OnboardingTimeline age={18} />)

      const blockTitle = screen.getByText(`à 18 ans`)

      expect(blockTitle).toBeOnTheScreen()
    })

    it('should display eighteen years old description', () => {
      render(<OnboardingTimeline age={18} />)

      const description = screen.getByText(`Tu auras 2 ans pour utiliser tes 300 €`)

      expect(description).toBeOnTheScreen()
    })
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => {
      jest.spyOn(SettingsContextAPI, 'useSettingsContext').mockReturnValue({
        data: { ...defaultSettings, wipEnableCreditV3: true },
        isLoading: false,
      })
    })

    it('should not display fifteen years old block', () => {
      render(<OnboardingTimeline age={15} />)

      const blockTitle = screen.queryByText(`à 15 ans`)

      expect(blockTitle).not.toBeOnTheScreen()
    })

    it('should not display sixteen years old block', () => {
      render(<OnboardingTimeline age={16} />)

      const blockTitle = screen.queryByText(`à 16 ans`)

      expect(blockTitle).not.toBeOnTheScreen()
    })

    it('should display seventeen years old block', () => {
      render(<OnboardingTimeline age={17} />)

      const blockTitle = screen.getByText(`à 17 ans`)

      expect(blockTitle).toBeOnTheScreen()
    })

    it('should display eighteen years old block', () => {
      render(<OnboardingTimeline age={18} />)

      const blockTitle = screen.getByText(`à 18 ans`)

      expect(blockTitle).toBeOnTheScreen()
    })

    it('should display eighteen years old description', () => {
      render(<OnboardingTimeline age={18} />)

      const description = screen.getByText(
        'Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.'
      )

      expect(description).toBeOnTheScreen()
    })
  })
})
