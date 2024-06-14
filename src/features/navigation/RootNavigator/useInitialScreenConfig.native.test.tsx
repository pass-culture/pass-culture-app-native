import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { SplashScreenProvider } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { renderHook, waitFor } from 'tests/utils'

import { useInitialScreen } from './useInitialScreenConfig'

const mockedUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt')

describe('useInitialScreen()', () => {
  beforeEach(() => {
    mockedUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      isUserLoading: false,
      user: beneficiaryUser,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
    })
  })

  afterAll(async () => {
    await storage.clear('has_seen_tutorials')
    await storage.clear('has_seen_eligible_card')
  })

  it('should return TabNavigator when logged in user has seen tutorials and eligible card without need to fill cultural survey', async () => {
    await storage.saveObject('has_seen_tutorials', true)
    await storage.saveObject('has_seen_eligible_card', true)
    // eslint-disable-next-line local-rules/independent-mocks
    mockedUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
      user: {
        ...beneficiaryUser,
        needsToFillCulturalSurvey: false,
        showEligibleCard: false,
        recreditAmountToShow: null,
      },
    })

    const result = await renderUseInitialScreen()

    await waitFor(() => {
      expect(result.current).toEqual('TabNavigator')
    })

    expect(analytics.logScreenView).toHaveBeenCalledTimes(1)
    expect(analytics.logScreenView).toHaveBeenCalledWith('Home')
  })

  it('should return CulturalSurveyIntro when user should see cultural survey', async () => {
    await storage.saveObject('has_seen_tutorials', true)
    await storage.saveObject('has_seen_eligible_card', true)
    // eslint-disable-next-line local-rules/independent-mocks
    mockedUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
      user: {
        ...beneficiaryUser,
        needsToFillCulturalSurvey: true,
        showEligibleCard: true,
        recreditAmountToShow: null,
      },
    })

    const result = await renderUseInitialScreen()

    await waitFor(() => {
      expect(result.current).toEqual('CulturalSurveyIntro')
    })

    expect(analytics.logScreenView).toHaveBeenCalledTimes(1)
    expect(analytics.logScreenView).toHaveBeenCalledWith('CulturalSurveyIntro')
  })

  it('should return EighteenBirthday when user hasn’t seen eligible card', async () => {
    await storage.saveObject('has_seen_tutorials', true)
    await storage.saveObject('has_seen_eligible_card', null)
    // eslint-disable-next-line local-rules/independent-mocks
    mockedUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
      user: {
        ...beneficiaryUser,
        needsToFillCulturalSurvey: true,
        showEligibleCard: true,
        recreditAmountToShow: null,
      },
    })

    const result = await renderUseInitialScreen()

    await waitFor(() => {
      expect(result.current).toEqual('EighteenBirthday')
    })

    expect(analytics.logScreenView).toHaveBeenCalledTimes(1)
    expect(analytics.logScreenView).toHaveBeenCalledWith('EighteenBirthday')
  })

  it('should return RecreditBirthdayNotification when user hasn’t seen eligible card and has credit to show', async () => {
    await storage.saveObject('has_seen_tutorials', true)
    await storage.saveObject('has_seen_eligible_card', null)
    // eslint-disable-next-line local-rules/independent-mocks
    mockedUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
      user: {
        ...beneficiaryUser,
        needsToFillCulturalSurvey: true,
        showEligibleCard: true,
        recreditAmountToShow: 3000,
      },
    })

    const result = await renderUseInitialScreen()

    await waitFor(() => {
      expect(result.current).toEqual('RecreditBirthdayNotification')
    })

    expect(analytics.logScreenView).toHaveBeenCalledTimes(1)
    expect(analytics.logScreenView).toHaveBeenCalledWith('RecreditBirthdayNotification')
  })

  it('should return TabNavigator when user is not logged in and has seen tutorial', async () => {
    await storage.saveObject('has_seen_tutorials', true)
    await storage.saveObject('has_seen_eligible_card', true)
    // eslint-disable-next-line local-rules/independent-mocks
    mockedUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })

    const result = await renderUseInitialScreen()

    await waitFor(() => {
      expect(result.current).toEqual('TabNavigator')
    })

    expect(analytics.logScreenView).toHaveBeenCalledTimes(1)
    expect(analytics.logScreenView).toHaveBeenCalledWith('Home')
  })

  it('should return OnboardingWelcome when user is not logged in and hasn’t seen tutorial yet', async () => {
    await storage.saveObject('has_seen_tutorials', null)
    await storage.saveObject('has_seen_eligible_card', true)
    // eslint-disable-next-line local-rules/independent-mocks
    mockedUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })

    const result = await renderUseInitialScreen()

    await waitFor(() => {
      expect(result.current).toEqual('OnboardingWelcome')
    })

    expect(analytics.logScreenView).toHaveBeenCalledTimes(1)
    expect(analytics.logScreenView).toHaveBeenCalledWith('OnboardingWelcome')
  })
})

async function renderUseInitialScreen() {
  const wrapper = (props: { children: unknown }) => (
    <SplashScreenProvider>{props.children as React.JSX.Element}</SplashScreenProvider>
  )
  const { result } = renderHook(useInitialScreen, { wrapper })
  return result
}
