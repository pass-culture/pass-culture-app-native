import React from 'react'
import { UseQueryResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { useCurrentRoute, navigateToHome } from 'features/navigation/helpers'
import { superFlushWithAct, act, render } from 'tests/utils'

import { CulturalSurvey } from './CulturalSurvey'

jest.mock('react-query')

const mockedUseUserProfileInfo = useUserProfileInfo as jest.MockedFunction<
  typeof useUserProfileInfo
>
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(),
}))

const mockedUseCurrentRoute = useCurrentRoute as jest.MockedFunction<typeof useCurrentRoute>
jest.mock('features/navigation/helpers')

beforeEach(() => {
  mockedUseUserProfileInfo.mockReturnValue({ data: { id: 1234 } } as UseQueryResult<
    UserProfileResponse,
    unknown
  >)
  mockedUseCurrentRoute.mockReturnValue({ name: 'CulturalSurvey', key: 'key' })
})

afterEach(jest.clearAllMocks)

describe('<CulturalSurvey />', () => {
  it('should render correctly', async () => {
    const renderAPI = await renderCulturalSurveyWithNavigation()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should not display webview when another screen is displayed', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseCurrentRoute.mockReturnValue({ name: 'Home', key: 'key' })
    const renderAPI = await renderCulturalSurveyWithNavigation()
    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeFalsy()
  })

  it('should display loading screen while user info is undefined', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseUserProfileInfo.mockReturnValue({ data: undefined } as UseQueryResult<
      UserProfileResponse,
      unknown
    >)
    const renderAPI = await renderCulturalSurveyWithNavigation()
    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeFalsy()
    expect(renderAPI.queryByTestId('Loading-Animation')).toBeTruthy()
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
