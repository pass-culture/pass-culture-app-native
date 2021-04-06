import { renderHook, RenderHookResult } from '@testing-library/react-hooks'
import { rest } from 'msw'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { server } from 'tests/server'
import { superFlushWithAct, act } from 'tests/utils'

import {
  InitialScreenConfiguration,
  useGetInitialScreenConfig,
} from '../RootNavigator/useGetInitialScreenConfig'

const mockedUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('features/auth/AuthContext')

describe('useGetInitialScreenConfig()', () => {
  beforeEach(() => {
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
      storage.saveObject('has_seen_tutorials', hasSeenTutorials)
      storage.saveObject('has_seen_eligible_card', hasSeenEligibleCard)
      mockedUseAuthContext.mockReturnValue({
        isLoggedIn: isLogged,
        setIsLoggedIn: jest.fn(),
      })
      mockMeApiCall(userProfile as UserProfileResponse)

      const testComponent = await renderUseGetInitialRouteName()

      await waitForExpect(() => {
        expect(testComponent?.result.current).toEqual({
          screen: expectedScreen,
          params: expectedScreenParams,
        })
      })
      expect(analytics.logScreenView).toBeCalledTimes(1)
      expect(analytics.logScreenView).toBeCalledWith(expectedAnalyticsScreen)
    }
  )
})

async function renderUseGetInitialRouteName() {
  let testComponent: RenderHookResult<unknown, InitialScreenConfiguration | undefined> | undefined
  await act(async () => {
    testComponent = renderHook(useGetInitialScreenConfig)
    await superFlushWithAct()
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
