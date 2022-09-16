/* eslint-disable local-rules/independant-mocks */
import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse, UserProfileResponse } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { useUserProfileInfo } from 'features/profile/api'
import { render, fireEvent } from 'tests/utils'

import { BeneficiaryRequestSent } from '../BeneficiaryRequestSent'

const mockedUseAppSettings = mocked(useAppSettings, true)
const mockedUseUserProfileInfo = mocked(useUserProfileInfo)
jest.mock('features/profile/api')
jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')
jest.mock('features/auth/settings')

describe('<BeneficiaryRequestSent />', () => {
  beforeEach(() => {
    mockedUseUserProfileInfo.mockReturnValue({
      data: { needsToFillCulturalSurvey: true },
    } as UseQueryResult<UserProfileResponse>)
  })

  it('should render correctly', () => {
    const renderAPI = render(<BeneficiaryRequestSent />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to cultural survey page WHEN "On y va\u00a0!" button is clicked', () => {
    const { getByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(getByText('On y va\u00a0!'))

    expect(navigateFromRef).not.toBeCalled()
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('CulturalSurvey', undefined)
  })

  it('should redirect to native cultural survey page WHEN "On y va\u00a0!" is clicked and feature flag is activated', () => {
    mockedUseAppSettings.mockReturnValueOnce({
      data: { enableNativeCulturalSurvey: true },
      isLoading: false,
    } as UseQueryResult<SettingsResponse, unknown>)
    const { getByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(getByText('On y va\u00a0!'))

    expect(navigateFromRef).not.toBeCalled()
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('CulturalSurveyIntro', undefined)
  })

  it('should redirect to home page WHEN "On y va\u00a0!" button is clicked and user does not need to fill cultural survey', () => {
    mockedUseUserProfileInfo.mockReturnValue({
      data: { needsToFillCulturalSurvey: false },
    } as UseQueryResult<UserProfileResponse>)
    const { getByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(getByText('On y va\u00a0!'))

    expect(navigateFromRef).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
    expect(navigate).not.toBeCalledWith('CulturalSurvey', undefined)
  })
})
