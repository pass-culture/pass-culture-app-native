import { renderHook, RenderHookResult } from '@testing-library/react-hooks'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { SplashScreenProvider } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { server } from 'tests/server'
import { superFlushWithAct, act } from 'tests/utils'

import { useInitialScreenConfig } from '../RootNavigator/useInitialScreenConfig'

const mockedUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('features/auth/AuthContext')

describe('useInitialScreenConfig()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await storage.clear('has_seen_tutorials')
    await storage.clear('has_seen_eligible_card')
  })

  // prettier-ignore : do not format the following "table" to keep it readable
  it.each`
    hasSeenTutorials | hasSeenEligibleCard | isLogged | userProfile                                                                           | expectedScreen        | expectedScreenParams                    | expectedAnalyticsScreen
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: false, showEligibleCard: false, isBeneficiary: true }} | ${'TabNavigator'}     | ${{ screen: 'Home' }}                   | ${'Home'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, isBeneficiary: false }} | ${'TabNavigator'}     | ${{ screen: 'Home' }}                   | ${'Home'}
    ${null}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, isBeneficiary: true }}  | ${'CulturalSurvey'}   | ${undefined}                            | ${'CulturalSurvey'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, isBeneficiary: true }}  | ${'CulturalSurvey'}   | ${undefined}                            | ${'CulturalSurvey'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true, isBeneficiary: true }}   | ${'CulturalSurvey'}   | ${undefined}                            | ${'CulturalSurvey'}
    ${true}          | ${null}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true, isBeneficiary: true }}   | ${'EighteenBirthday'} | ${undefined}                            | ${'EighteenBirthday'}
    ${true}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, isBeneficiary: true }}  | ${'TabNavigator'}     | ${{ screen: 'Home' }}                   | ${'Home'}
    ${true}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: false, showEligibleCard: true, isBeneficiary: true }}  | ${'TabNavigator'}     | ${{ screen: 'Home' }}                   | ${'Home'}
    ${null}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: false, showEligibleCard: false, isBeneficiary: true }} | ${'FirstTutorial'}    | ${{ shouldCloseAppOnBackAction: true }} | ${'FirstTutorial'}
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

      await waitForExpect(() => {
        if (expectedScreen === 'TabNavigator') {
          expect(navigate).toHaveBeenNthCalledWith(1, expectedScreen, expectedScreenParams)
        } else {
          expect(reset).toHaveBeenNthCalledWith(1, {
            index: 0,
            routes: [{ name: expectedScreen, params: expectedScreenParams }],
          })
        }
      })
      expect(analytics.logScreenView).toBeCalledTimes(1)
      expect(analytics.logScreenView).toBeCalledWith(expectedAnalyticsScreen)
    }
  )
})

async function renderUseInitialScreenConfig() {
  const wrapper = (props: { children: unknown }) => (
    <SplashScreenProvider>{props.children as Element}</SplashScreenProvider>
  )
  let testComponent: RenderHookResult<{ children: unknown }, void | undefined> | undefined
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
