import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/navigateToHome')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('CulturalSurveyThanksPage page', () => {
  describe('When FF is disabled', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it('should render the page with correct layout and content', () => {
      render(<CulturalSurveyThanks />)

      expect(screen).toMatchSnapshot()
    })

    it('should navigate to IdentityCheckHonor screen when pressing "Continuer" button', async () => {
      render(<CulturalSurveyThanks />)

      const continueButton = screen.getByText('Continuer')
      await user.press(continueButton)

      expect(reset).toHaveBeenCalledWith({
        index: 0,
        routes: [
          {
            name: 'SubscriptionStackNavigator',
            state: {
              index: 0,
              routes: [
                {
                  name: 'IdentityCheckHonor',
                },
              ],
            },
          },
        ],
      })
    })
  })
})
