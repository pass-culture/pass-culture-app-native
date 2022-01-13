import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { SplashScreenProvider } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'

import { useInitialScreen } from '../RootNavigator/useInitialScreenConfig'

const mockedUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('features/auth/AuthContext')

describe('useInitialScreen()', () => {
  afterAll(async () => {
    await storage.clear('has_seen_tutorials')
    await storage.clear('has_seen_eligible_card')
  })

  // prettier-ignore : do not format the following "table" to keep it readable
  it.each`
    hasSeenTutorials | hasSeenEligibleCard | isLogged | userProfile                                                                                  | expectedScreen                    | expectedAnalyticsScreen
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: false, showEligibleCard: false, recreditAmountToShow: null }} | ${'TabNavigator'}                 | ${'Home'}
    ${null}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, recreditAmountToShow: null }}  | ${'CulturalSurvey'}               | ${'CulturalSurvey'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, recreditAmountToShow: null }}  | ${'CulturalSurvey'}               | ${'CulturalSurvey'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true, recreditAmountToShow: null }}   | ${'CulturalSurvey'}               | ${'CulturalSurvey'}
    ${true}          | ${null}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true, recreditAmountToShow: null }}   | ${'EighteenBirthday'}             | ${'EighteenBirthday'}
    ${true}          | ${null}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true, recreditAmountToShow: 3000 }}   | ${'RecreditBirthdayNotification'} | ${'RecreditBirthdayNotification'}
    ${true}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, recreditAmountToShow: null }}  | ${'TabNavigator'}                 | ${'Home'}
    ${true}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: false, showEligibleCard: true, recreditAmountToShow: null }}  | ${'TabNavigator'}                 | ${'Home'}
    ${null}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: false, showEligibleCard: false, recreditAmountToShow: null }} | ${'FirstTutorial'}                | ${'FirstTutorial'}
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
      })
      mockMeApiCall(userProfile as UserProfileResponse)

      const { current: screen } = await renderUseInitialScreen()

      await waitForExpect(() => {
        expect(screen).toEqual(expectedScreen)
      })
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
