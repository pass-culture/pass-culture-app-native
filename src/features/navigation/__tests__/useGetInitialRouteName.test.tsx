import { renderHook, RenderHookResult } from '@testing-library/react-hooks'
import { act } from '@testing-library/react-native'
import { rest } from 'msw'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'

import { InitialRouteName, useGetInitialRouteName } from '../RootNavigator/useGetInitialRouteName'

async function renderUseGetInitialRouteName() {
  let testComponent: RenderHookResult<unknown, InitialRouteName> | undefined
  await act(async () => {
    testComponent = renderHook(useGetInitialRouteName)
    await superFlushWithAct()
  })
  await superFlushWithAct()
  return testComponent
}

const mockedUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('features/auth/AuthContext')

describe('useGetInitialRouteName()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    })
    simulateUserProfileNeedNotToFillCulturalSurvey()
  })
  afterEach(async () => {
    await storage.clear('has_seen_tutorials')
  })

  it('returns TabNavigator when user has already seen tutorials and need NOT fill survey', async () => {
    storage.saveObject('has_seen_tutorials', true)
    const testComponent = await renderUseGetInitialRouteName()

    await waitForExpect(() => {
      expect(testComponent?.result.current).toEqual('TabNavigator')
    })
    expect(analytics.logScreenView).toBeCalledTimes(1)
    expect(analytics.logScreenView).toBeCalledWith('Home')
  })

  it('returns CulturalSurvey when user has NOT seen tutorials and needs to fill survey', async () => {
    simulateUserProfileNeedsToFillCulturalSurvey()
    storage.saveObject('has_seen_tutorials', false)
    const testComponent = await renderUseGetInitialRouteName()

    await waitForExpect(() => {
      expect(testComponent?.result.current).toEqual('CulturalSurvey')
    })
    expect(analytics.logScreenView).toBeCalledTimes(1)
    expect(analytics.logScreenView).toBeCalledWith('CulturalSurvey')
  })

  it('returns CulturalSurvey when user has seen tutorials and needs to fill survey', async () => {
    simulateUserProfileNeedsToFillCulturalSurvey()
    storage.saveObject('has_seen_tutorials', true)
    const testComponent = await renderUseGetInitialRouteName()

    await waitForExpect(() => {
      expect(testComponent?.result.current).toEqual('CulturalSurvey')
    })
    expect(analytics.logScreenView).toBeCalledTimes(1)
    expect(analytics.logScreenView).toBeCalledWith('CulturalSurvey')
  })

  it('should NOT return CulturalSurvey when user is NOT logged in, eventhough the user needs to fill the survey', async () => {
    simulateUserProfileNeedsToFillCulturalSurvey()
    storage.saveObject('has_seen_tutorials', true)
    mockedUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
    })
    const testComponent = await renderUseGetInitialRouteName()

    await waitForExpect(() => {
      expect(testComponent?.result.current).toEqual('TabNavigator')
    })
  })

  it('returns FirstTutorial when user has NOT seen tutorials and need NOT to fill survey', async () => {
    storage.saveObject('has_seen_tutorials', false)
    const testComponent = await renderUseGetInitialRouteName()

    await waitForExpect(() => {
      expect(testComponent?.result.current).toEqual('FirstTutorial')
    })
    expect(analytics.logScreenView).toBeCalledTimes(1)
    expect(analytics.logScreenView).toBeCalledWith('FirstTutorial')
  })
})

function simulateUserProfileNeedsToFillCulturalSurvey() {
  server.use(
    rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ needsToFillCulturalSurvey: true } as UserProfileResponse)
      )
    })
  )
}

function simulateUserProfileNeedNotToFillCulturalSurvey() {
  server.use(
    rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ needsToFillCulturalSurvey: false } as UserProfileResponse)
      )
    })
  )
}
