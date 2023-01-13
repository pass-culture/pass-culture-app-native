/* eslint-disable local-rules/independent-mocks */
import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { render, fireEvent } from 'tests/utils'

import { BeneficiaryRequestSent } from './BeneficiaryRequestSent'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')
jest.mock('features/auth/context/SettingsContext')
const mockedUseSettingsContext = useSettingsContext as jest.MockedFunction<
  typeof useSettingsContext
>

const mockedUseAuthContext = useAuthContext as jest.Mock
jest.mock('features/auth/context/AuthContext')

describe('<BeneficiaryRequestSent />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<BeneficiaryRequestSent />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to cultural survey page WHEN "On y va !" button is clicked', () => {
    const { getByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(getByText('On y va\u00a0!'))

    expect(navigateFromRef).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('CulturalSurvey', undefined)
  })

  it('should redirect to native cultural survey page WHEN "On y va !" is clicked and feature flag is activated', () => {
    mockedUseSettingsContext.mockReturnValueOnce({
      data: { enableNativeCulturalSurvey: true },
      isLoading: false,
    } as UseQueryResult<SettingsResponse, unknown>)
    const { getByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(getByText('On y va\u00a0!'))

    expect(navigateFromRef).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('CulturalSurveyIntro', undefined)
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user does not need to fill cultural survey', () => {
    mockedUseAuthContext.mockImplementationOnce(() => ({
      user: { needsToFillCulturalSurvey: false },
    }))

    const { getByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(getByText('On y va\u00a0!'))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
    expect(navigate).not.toHaveBeenCalledWith('CulturalSurvey', undefined)
  })
})
