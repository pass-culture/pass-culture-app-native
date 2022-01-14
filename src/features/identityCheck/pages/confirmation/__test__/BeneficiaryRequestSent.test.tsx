/* eslint-disable local-rules/independant-mocks */
import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse, UserProfileResponse } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { render, fireEvent } from 'tests/utils'

import { BeneficiaryRequestSent } from '../BeneficiaryRequestSent'

const mockedUseAppSettings = mocked(useAppSettings, true)
const mockedUseUserProfileInfo = mocked(useUserProfileInfo)
jest.mock('features/home/api')
jest.mock('features/navigation/helpers')
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

  it('should redirect to cultural survey page WHEN "On y va !" button is clicked', () => {
    const { getByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(getByText('On y va\u00a0!'))

    expect(navigateToHome).not.toBeCalled()
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('CulturalSurvey')
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user needs not to fill cultural survey', () => {
    mockedUseUserProfileInfo.mockReturnValue({
      data: { needsToFillCulturalSurvey: false },
    } as UseQueryResult<UserProfileResponse>)
    const { getByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(getByText('On y va\u00a0!'))

    expect(navigateToHome).toBeCalledTimes(1)
    expect(navigate).not.toBeCalledWith('CulturalSurvey')
  })

  it('should show specific body message when retention is on and cultural survey is off', () => {
    mockedUseAppSettings.mockReturnValueOnce({
      data: { enableIdCheckRetention: true },
      isLoading: false,
    } as UseQueryResult<SettingsResponse, unknown>)

    mockedUseUserProfileInfo.mockReturnValue({
      data: { needsToFillCulturalSurvey: false },
    } as UseQueryResult<UserProfileResponse>)

    const { getByText } = render(<BeneficiaryRequestSent />)
    getByText(
      "Tu recevras une réponse par e-mail sous 5 jours ouvrés. En attendant, tu peux découvrir l'application\u00a0!"
    )
  })

  it('should show specific body message when retention is on and cultural survey is on', () => {
    mockedUseAppSettings.mockReturnValueOnce({
      data: { enableIdCheckRetention: true },
      isLoading: false,
    } as UseQueryResult<SettingsResponse, unknown>)
    mockedUseUserProfileInfo.mockReturnValue({
      data: { needsToFillCulturalSurvey: true },
    } as UseQueryResult<UserProfileResponse>)
    const { getByText } = render(<BeneficiaryRequestSent />)
    getByText(
      'Tu recevras une réponse par e-mail sous 5 jours ouvrés. En attendant, aide-nous à en savoir plus sur tes pratiques culturelles\u00a0!'
    )
  })
})
