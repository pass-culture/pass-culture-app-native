import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { useCulturalSurveyContext } from 'features/culturalSurvey/context/__mocks__/CulturalSurveyContextProvider'
import * as CulturalSurveyContextProviderModule from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/navigateToHome')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest
  .spyOn(CulturalSurveyContextProviderModule, 'useCulturalSurveyContext')
  .mockImplementation(useCulturalSurveyContext)

const user = userEvent.setup()
jest.useFakeTimers()

describe('CulturalSurveyThanksPage page', () => {
  it('should display new vision UI illustration when WIP_NEW_VISION_UI FF is enabled', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])

    render(<CulturalSurveyThanks />)

    expect(screen.getByTestId('remote-illustration')).toBeOnTheScreen()
  })

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
