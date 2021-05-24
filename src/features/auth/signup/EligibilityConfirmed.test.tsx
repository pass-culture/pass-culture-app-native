import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { homeNavigateConfig } from 'features/navigation/helpers'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent } from 'tests/utils'

import { EligibilityConfirmed } from './EligibilityConfirmed'

const mockedUseUserProfileInfo = mocked(useUserProfileInfo)
jest.mock('features/home/api')

describe('<EligibilityConfirmed />', () => {
  afterEach(jest.clearAllMocks)

  it('should redirect to home page WHEN "On y va !" button is clicked and user.needsToFillCulturalSurvey is false', async () => {
    mockedUseUserProfileInfo.mockReturnValue({
      data: { needsToFillCulturalSurvey: false },
    } as UseQueryResult<UserProfileResponse>)

    const { findByText } = renderEligibilityConfirmed()

    const button = await findByText('On y va !')
    fireEvent.press(button)

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith(homeNavigateConfig.screen, homeNavigateConfig.params)
  })
  it('should redirect to cultural survey page WHEN "On y va !" button is clicked  and user.needsToFillCulturalSurvey is true', async () => {
    mockedUseUserProfileInfo.mockReturnValue({
      data: { needsToFillCulturalSurvey: true },
    } as UseQueryResult<UserProfileResponse>)
    const { findByText } = renderEligibilityConfirmed()

    const button = await findByText('On y va !')
    fireEvent.press(button)

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('CulturalSurvey')
  })
})

const renderEligibilityConfirmed = () => render(reactQueryProviderHOC(<EligibilityConfirmed />))
