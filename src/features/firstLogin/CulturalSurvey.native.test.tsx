import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useCurrentRoute, navigateToHome } from 'features/navigation/helpers'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { act, render, waitFor } from 'tests/utils'

import { CulturalSurvey } from './CulturalSurvey'

jest.mock('react-query')

const mockedUseCurrentRoute = useCurrentRoute as jest.MockedFunction<typeof useCurrentRoute>
jest.mock('features/navigation/helpers')
function mockUseCurrentRoute(name: string) {
  mockedUseCurrentRoute.mockReturnValue({ name, key: 'key' })
}

jest.mock('features/auth/context/SettingsContext')
const mockedUseSettingsContext = useSettingsContext as jest.MockedFunction<
  typeof useSettingsContext
>

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

const DEFAULT_USER = {
  id: 1234,
  needsToFillCulturalSurvey: true,
} as UserProfileResponse
beforeEach(() => {
  mockUseCurrentRoute('CulturalSurvey')
})

describe('<CulturalSurvey />', () => {
  it('should render correctly', async () => {
    const renderAPI = renderCulturalSurveyWithNavigation()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to native cultural survey if FF is active', async () => {
    mockedUseSettingsContext.mockReturnValueOnce({
      data: { enableNativeCulturalSurvey: true },
    } as UseQueryResult<SettingsResponse, unknown>)
    renderCulturalSurveyWithNavigation()
    expect(navigate).toHaveBeenCalledWith('CulturalSurveyIntro')
  })

  it('should not display webview when another screen is displayed', async () => {
    mockUseCurrentRoute('Home')
    const renderAPI = renderCulturalSurveyWithNavigation()
    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeNull()
  })

  it('should display loading screen while user info is undefined and isLoading is true', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: undefined,
      isUserLoading: true,
    })
    const renderAPI = renderCulturalSurveyWithNavigation()
    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeNull()
    expect(renderAPI.queryByTestId('Loading-Animation')).toBeTruthy()
  })

  it('should navigate to Home when user is undefined and isLoading is false', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: undefined,
      isUserLoading: false,
    })
    renderCulturalSurveyWithNavigation()
    expect(navigate).toHaveBeenNthCalledWith(1, ...homeNavConfig)
  })

  it('should navigate to Home if user has already completed survey', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...DEFAULT_USER, needsToFillCulturalSurvey: false },
      isUserLoading: false,
    })
    renderCulturalSurveyWithNavigation()
    expect(navigate).toHaveBeenNthCalledWith(1, ...homeNavConfig)
  })

  it('should NOT close webview when navigation state has url containing "typeform.com"', async () => {
    const renderAPI = renderCulturalSurveyWithNavigation()
    act(() => {
      const webview = renderAPI.getByTestId('cultural-survey-webview')
      // onNavigationStateChange is triggered when the WebView loading starts or ends
      webview.props.onLoadingStart({
        nativeEvent: { url: 'passculture.typeform.com' },
      })
    })
    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeTruthy()
    expect(navigate).not.toBeCalled()
  })

  it('should close webview when navigation state has url not containing "typeform.com"', async () => {
    const renderAPI = renderCulturalSurveyWithNavigation()
    act(() => {
      const webview = renderAPI.getByTestId('cultural-survey-webview')
      // onNavigationStateChange is triggered when the WebView loading starts or ends
      webview.props.onLoadingStart({
        nativeEvent: { url: 'app.passculture' },
      })
    })
    await waitFor(() => {
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })
})

function renderCulturalSurveyWithNavigation() {
  const renderAPI = render(<CulturalSurvey />)
  return renderAPI
}
