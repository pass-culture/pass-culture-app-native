import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { SplashScreenProvider } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'

import { useInitialScreen } from '../RootNavigator/useInitialScreenConfig'

describe('useInitialScreen()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await storage.clear('has_seen_tutorials')
    await storage.clear('has_seen_eligible_card')
  })

  // prettier-ignore : do not format the following "table" to keep it readable
  it.each`
    hasSeenTutorials | hasSeenEligibleCard | isLogged | userProfile                                                                           | expectedScreen        | expectedAnalyticsScreen
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: false, showEligibleCard: false, isBeneficiary: true }} | ${'TabNavigator'}     | ${'Home'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, isBeneficiary: false }} | ${'TabNavigator'}     | ${'Home'}
    ${null}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, isBeneficiary: true }}  | ${'CulturalSurvey'}   | ${'CulturalSurvey'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, isBeneficiary: true }}  | ${'CulturalSurvey'}   | ${'CulturalSurvey'}
    ${true}          | ${true}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true, isBeneficiary: true }}   | ${'CulturalSurvey'}   | ${'CulturalSurvey'}
    ${true}          | ${null}             | ${true}  | ${{ needsToFillCulturalSurvey: true, showEligibleCard: true, isBeneficiary: true }}   | ${'EighteenBirthday'} | ${'EighteenBirthday'}
    ${true}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: true, showEligibleCard: false, isBeneficiary: true }}  | ${'TabNavigator'}     | ${'Home'}
    ${true}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: false, showEligibleCard: true, isBeneficiary: true }}  | ${'TabNavigator'}     | ${'Home'}
    ${null}          | ${true}             | ${false} | ${{ needsToFillCulturalSurvey: false, showEligibleCard: false, isBeneficiary: true }} | ${'FirstTutorial'}    | ${'FirstTutorial'}
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
      if (isLogged) {
        mockMeApiCall200(userProfile as UserProfileResponse)
      } else {
        mockMeApiCall403()
      }

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

function mockMeApiCall200(response: UserProfileResponse) {
  server.use(
    rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(response))
    })
  )
}

function mockMeApiCall403() {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(ctx.status(403))
    })
  )
}
