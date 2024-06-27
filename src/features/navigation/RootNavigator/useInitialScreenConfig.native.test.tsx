import React from 'react'

import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { SplashScreenProvider } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { renderHook, waitFor } from 'tests/utils'

import { useInitialScreen } from './useInitialScreenConfig'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

describe('useInitialScreen()', () => {
  afterAll(async () => {
    await storage.clear('has_seen_tutorials')
    await storage.clear('has_seen_eligible_card')
  })

  it('should return TabNavigator when logged in user has seen tutorials and eligible card without need to fill cultural survey', async () => {
    await storage.saveObject('has_seen_tutorials', true)
    await storage.saveObject('has_seen_eligible_card', true)
    mockAuthContextWithUser(
      {
        ...beneficiaryUser,
        needsToFillCulturalSurvey: false,
        showEligibleCard: false,
        recreditAmountToShow: null,
      },
      { persist: true }
    )

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
    mockAuthContextWithUser(
      {
        ...beneficiaryUser,
        needsToFillCulturalSurvey: true,
        showEligibleCard: true,
        recreditAmountToShow: null,
      },
      { persist: true }
    )

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
    mockAuthContextWithUser(
      {
        ...beneficiaryUser,
        needsToFillCulturalSurvey: true,
        showEligibleCard: true,
        recreditAmountToShow: null,
      },
      { persist: true }
    )

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
    mockAuthContextWithUser(
      {
        ...beneficiaryUser,
        needsToFillCulturalSurvey: true,
        showEligibleCard: true,
        recreditAmountToShow: 3000,
      },
      { persist: true }
    )

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
    mockAuthContextWithoutUser({ persist: true })

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
    mockAuthContextWithoutUser({ persist: true })

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
