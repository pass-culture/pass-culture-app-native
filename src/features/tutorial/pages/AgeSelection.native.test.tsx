import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { AgeSelection } from './AgeSelection'

const AGES = [15, 16, 17, 18]

jest.mock('features/navigation/navigationRef')

describe('AgeSelection', () => {
  beforeEach(async () => {
    await storage.clear('user_age')
  })

  describe('onboarding', () => {
    it('should render correctly', () => {
      render(<AgeSelection type="onboarding" />)

      expect(screen).toMatchSnapshot()
    })

    it.each(AGES)(
      'should navigate to OnboardingAgeInformation page with params age=%s when pressing "j’ai %s ans"',
      async (age) => {
        render(<AgeSelection type="onboarding" />)

        const button = screen.getByText(`${age} ans`)
        fireEvent.press(button)

        await waitFor(() => {
          expect(navigate).toHaveBeenCalledWith('OnboardingAgeInformation', { age })
        })
      }
    )

    it('should navigate to AgeSelectionOther page when pressing "Autre"', async () => {
      render(<AgeSelection type="onboarding" />)

      const button = screen.getByText('Autre')
      fireEvent.press(button)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('AgeSelectionOther', undefined)
      })
    })

    it.each(AGES)('should log analytics with params age=%s when pressing "j’ai %s ans"', (age) => {
      render(<AgeSelection type="onboarding" />)

      const button = screen.getByText(`${age} ans`)
      fireEvent.press(button)

      expect(analytics.logSelectAge).toHaveBeenCalledWith(age)
    })

    it('should log analytics when pressing "Autre"', () => {
      render(<AgeSelection type="onboarding" />)

      const button = screen.getByText('Autre')
      fireEvent.press(button)

      expect(analytics.logSelectAge).toHaveBeenCalledWith('other')
    })

    it.each(AGES)(
      'should set user age to %s in local storage  when pressing "j’ai %s ans"',
      async (age) => {
        render(<AgeSelection type="onboarding" />)

        const button = screen.getByText(`${age} ans`)
        fireEvent.press(button)

        const userAge = await storage.readObject('user_age')
        expect(userAge).toBe(age)
      }
    )
  })

  describe('profileTutorial', () => {
    it('should render correctly', () => {
      render(<AgeSelection type="profileTutorial" />)

      expect(screen).toMatchSnapshot()
    })
  })
})
