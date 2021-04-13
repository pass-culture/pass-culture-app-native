import { renderHook, RenderHookResult } from '@testing-library/react-hooks'
import { rest } from 'msw'
import React from 'react'
import SplashScreen from 'react-native-splash-screen'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { DEFAULT_SPLASHSCREEN_DELAY, SplashScreenProvider } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { server } from 'tests/server'
import { superFlushWithAct, act } from 'tests/utils'

import { useInitialScreenConfig } from '../RootNavigator/useInitialScreenConfig'

const mockedUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('features/auth/AuthContext')

describe('useInitialScreenConfig()', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await storage.clear('has_seen_tutorials')
    await storage.clear('has_seen_eligible_card')
  })

  // prettier-ignore : do not format the following "table" to keep it readable
  it.each`
    hasSeenTutorials | hasSeenEligibleCard | isLogged | userProfile                                                      | expectedScreen        | expectedScreenParams                                              | expectedAnalyticsScreen
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: false, showEligibleCard: false }} | ${'TabNavigator'}     | ${{ screen: 'Home', params: { shouldDisplayLoginModal: false } }} | ${'Home'}
    ${null}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false }}  | ${'CulturalSurvey'}   | ${undefined}                                                      | ${'CulturalSurvey'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false }}  | ${'CulturalSurvey'}   | ${undefined}                                                      | ${'CulturalSurvey'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true }}   | ${'CulturalSurvey'}   | ${undefined}                                                      | ${'CulturalSurvey'}
    ${true}          | ${null}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true }}   | ${'EighteenBirthday'} | ${undefined}                                                      | ${'EighteenBirthday'}
    ${true}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false }}  | ${'TabNavigator'}     | ${{ screen: 'Home', params: { shouldDisplayLoginModal: false } }} | ${'Home'}
    ${true}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: false, showEligibleCard: true }}  | ${'TabNavigator'}     | ${{ screen: 'Home', params: { shouldDisplayLoginModal: false } }} | ${'Home'}
    ${null}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: false, showEligibleCard: false }} | ${'FirstTutorial'}    | ${undefined}                                                      | ${'FirstTutorial'}
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
      expectedScreenParams,
      expectedAnalyticsScreen,
    }) => {
      await storage.saveObject('has_seen_tutorials', hasSeenTutorials)
      await storage.saveObject('has_seen_eligible_card', hasSeenEligibleCard)
      mockedUseAuthContext.mockReturnValue({
        isLoggedIn: isLogged,
        setIsLoggedIn: jest.fn(),
      })
      mockMeApiCall(userProfile as UserProfileResponse)

      await renderUseInitialScreenConfig()
      await waitForSplashScreenDelay()

      await waitForExpect(() => {
        expect(navigate).toHaveBeenNthCalledWith(1, expectedScreen, expectedScreenParams)
      })
      expect(analytics.logScreenView).toBeCalledTimes(1)
      expect(analytics.logScreenView).toBeCalledWith(expectedAnalyticsScreen)
    }
  )

  it('should call SplashScreen.hide() after 200ms', async () => {
    expect.assertions(2)

    await renderUseInitialScreenConfig()
    expect(SplashScreen.hide).toBeCalledTimes(0)

    await waitForSplashScreenDelay()
    expect(SplashScreen.hide).toBeCalledTimes(1)
  })
})

async function renderUseInitialScreenConfig() {
  const wrapper = (props: { children: any }) => (
    <SplashScreenProvider>{props.children}</SplashScreenProvider>
  )
  let testComponent: RenderHookResult<{ children: any }, void | undefined> | undefined
  await act(async () => {
    testComponent = renderHook(useInitialScreenConfig, { wrapper })
  })
  await superFlushWithAct()
  return testComponent
}

function mockMeApiCall(response: UserProfileResponse) {
  server.use(
    rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(response))
    })
  )
}

async function waitForSplashScreenDelay() {
  act(() => {
    jest.advanceTimersByTime(DEFAULT_SPLASHSCREEN_DELAY)
  })
  await superFlushWithAct()
}
