import { rest } from 'msw'
import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { SplashScreenProvider } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { server } from 'tests/server'
import { renderHook, superFlushWithAct } from 'tests/utils'

import { useInitialScreen } from './useInitialScreenConfig'

const mockedUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('features/auth/context/AuthContext')

describe('useInitialScreen()', () => {
  afterAll(async () => {
    await storage.clear('has_seen_tutorials')
    await storage.clear('has_seen_eligible_card')
  })

  // prettier-ignore : do not format the following "table" to keep it readable
  it.each`
    hasSeenTutorials | hasSeenEligibleCard | isLogged | userProfile                                                                                  | expectedScreen                    | expectedAnalyticsScreen
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: false, showEligibleCard: false, recreditAmountToShow: null }} | ${'TabNavigator'}                 | ${'Home'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true, recreditAmountToShow: null }}   | ${'CulturalSurveyIntro'}          | ${'CulturalSurveyIntro'}
    ${true}          | ${null}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true, recreditAmountToShow: null }}   | ${'EighteenBirthday'}             | ${'EighteenBirthday'}
    ${true}          | ${null}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true, recreditAmountToShow: 3000 }}   | ${'RecreditBirthdayNotification'} | ${'RecreditBirthdayNotification'}
    ${true}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, recreditAmountToShow: null }}  | ${'TabNavigator'}                 | ${'Home'}
    ${true}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: false, showEligibleCard: true, recreditAmountToShow: null }}  | ${'TabNavigator'}                 | ${'Home'}
    ${null}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: false, showEligibleCard: false, recreditAmountToShow: null }} | ${'OnboardingWelcome'}            | ${'OnboardingWelcome'}
  `(
    `should return $expectedScreen when 
      - has_seen_tutorials = $hasSeenTutorials 
      - has_seen_eligible_card = $hasSeenEligibleCard
      - isLogged = $isLogged 
      - user profile = $userProfile`,
    async ({
      hasSeenTutorials,
      hasSeenEligibleCard,
      isLogged,
      userProfile,
      expectedScreen,
      expectedAnalyticsScreen,
    }) => {
      await storage.saveObject('has_seen_tutorials', hasSeenTutorials)
      await storage.saveObject('has_seen_eligible_card', hasSeenEligibleCard)
      mockedUseAuthContext.mockReturnValue({
        isLoggedIn: isLogged,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
      mockMeApiCall(userProfile as UserProfileResponse)

      const { current: screen } = await renderUseInitialScreen()

      expect(screen).toEqual(expectedScreen)
      expect(analytics.logScreenView).toBeCalledTimes(1)
      expect(analytics.logScreenView).toBeCalledWith(expectedAnalyticsScreen)
    }
  )
})

async function renderUseInitialScreen() {
  const wrapper = (props: { children: unknown }) => (
    <SplashScreenProvider>{props.children as JSX.Element}</SplashScreenProvider>
  )
  const { result } = renderHook(useInitialScreen, { wrapper })
  await superFlushWithAct()
  return result
}

function mockMeApiCall(response: UserProfileResponse) {
  server.use(
    rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(response))
    })
  )
}
