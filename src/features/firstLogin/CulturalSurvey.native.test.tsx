import React from 'react'
import { UseQueryResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { navigate, replace } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { useCurrentRoute, navigateToHome } from 'features/navigation/helpers'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { superFlushWithAct, act, render } from 'tests/utils'

import { CulturalSurvey } from './CulturalSurvey'

jest.mock('react-query')

const mockedUseUserProfileInfo = useUserProfileInfo as jest.MockedFunction<
  typeof useUserProfileInfo
>
jest.mock('features/home/api')
function mockUserProfileInfo({ user, isError }: { user?: UserProfileResponse; isError?: boolean }) {
  mockedUseUserProfileInfo.mockReturnValue({ data: user, isError } as UseQueryResult<
    UserProfileResponse,
    unknown
  >)
}

const mockedUseCurrentRoute = useCurrentRoute as jest.MockedFunction<typeof useCurrentRoute>
jest.mock('features/navigation/helpers')
function mockUseCurrentRoute(name: string) {
  mockedUseCurrentRoute.mockReturnValue({ name, key: 'key' })
}

const DEFAULT_USER = {
  id: 1234,
  needsToFillCulturalSurvey: true,
  isBeneficiary: true,
} as UserProfileResponse
beforeEach(() => {
  mockUserProfileInfo({ user: DEFAULT_USER })
  mockUseCurrentRoute('CulturalSurvey')
})

afterEach(jest.clearAllMocks)

describe('<CulturalSurvey />', () => {
  it('should render correctly', async () => {
    const renderAPI = await renderCulturalSurveyWithNavigation()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should not display webview when another screen is displayed', async () => {
    mockUseCurrentRoute('Home')
    const renderAPI = await renderCulturalSurveyWithNavigation()
    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeFalsy()
  })

  it('should display loading screen while user info is undefined', async () => {
    mockUserProfileInfo({ user: undefined, isError: false })
    const renderAPI = await renderCulturalSurveyWithNavigation()
    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeFalsy()
    expect(renderAPI.queryByTestId('Loading-Animation')).toBeTruthy()
  })

  it('should replace screen by Home when useUserProfileInfo has an error', async () => {
    mockUserProfileInfo({ isError: true })
    await renderCulturalSurveyWithNavigation()
    expect(replace).toHaveBeenNthCalledWith(1, ...homeNavConfig)
  })

  it('should replace screen by Home if user has already completed survey', async () => {
    mockUserProfileInfo({ user: { ...DEFAULT_USER, needsToFillCulturalSurvey: false } })
    await renderCulturalSurveyWithNavigation()
    expect(replace).toHaveBeenNthCalledWith(1, ...homeNavConfig)
  })

  it('should replace screen by Home if user is not beneficiary', async () => {
    mockUserProfileInfo({ user: { ...DEFAULT_USER, isBeneficiary: false } })
    await renderCulturalSurveyWithNavigation()
    expect(replace).toHaveBeenNthCalledWith(1, ...homeNavConfig)
  })

  it('should NOT close webview when navigation state has url containing "typeform.com"', async () => {
    const renderAPI = await renderCulturalSurveyWithNavigation()
    act(() => {
      const webview = renderAPI.getByTestId('cultural-survey-webview')
      webview.props.onNavigationStateChange({ url: 'passculture.typeform.com' })
    })
    await superFlushWithAct()
    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeTruthy()
    expect(navigate).not.toBeCalled()
  })

  it('should close webview when navigation state has url not containing "typeform.com"', async () => {
    const renderAPI = await renderCulturalSurveyWithNavigation()
    act(() => {
      const webview = renderAPI.getByTestId('cultural-survey-webview')
      webview.props.onNavigationStateChange({ url: 'app.passculture' })
    })
    await superFlushWithAct()
    await waitForExpect(() => {
      expect(navigateToHome).toBeCalled()
    })
  })
})

async function renderCulturalSurveyWithNavigation() {
  const renderAPI = render(<CulturalSurvey />)
  await superFlushWithAct()
  return renderAPI
}
