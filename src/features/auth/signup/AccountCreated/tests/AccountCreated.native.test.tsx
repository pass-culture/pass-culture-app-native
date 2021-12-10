import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { render, fireEvent } from 'tests/utils'

import { AccountCreated } from '../AccountCreated'

const mockedUseUserProfileInfo = mocked(useUserProfileInfo)
jest.mock('features/home/api')
jest.mock('features/navigation/helpers')
jest.mock('features/auth/settings')

beforeEach(() => {
  mockedUseUserProfileInfo.mockReturnValue({
    data: { isBeneficiary: true, needsToFillCulturalSurvey: true },
  } as UseQueryResult<UserProfileResponse>)
})

describe('<AccountCreated />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AccountCreated />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to cultural survey page WHEN "On y va !" button is clicked', async () => {
    const renderAPI = render(<AccountCreated />)

    fireEvent.press(await renderAPI.findByText('On y va !'))

    expect(navigateToHome).not.toBeCalledTimes(1)
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('CulturalSurvey')
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user is not beneficiary', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseUserProfileInfo.mockReturnValue({
      data: { isBeneficiary: false, needsToFillCulturalSurvey: true },
    } as UseQueryResult<UserProfileResponse>)
    const renderAPI = render(<AccountCreated />)

    fireEvent.press(await renderAPI.findByText('On y va !'))

    expect(navigateToHome).toBeCalledTimes(1)
    expect(navigate).not.toBeCalledWith('CulturalSurvey')
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user needs not to fill cultural survey', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseUserProfileInfo.mockReturnValue({
      data: { isBeneficiary: true, needsToFillCulturalSurvey: false },
    } as UseQueryResult<UserProfileResponse>)
    const renderAPI = render(<AccountCreated />)

    fireEvent.press(await renderAPI.findByText('On y va !'))

    expect(navigateToHome).toBeCalledTimes(1)
    expect(navigate).not.toBeCalledWith('CulturalSurvey')
  })
})
