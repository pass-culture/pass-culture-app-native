import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { render, fireEvent } from 'tests/utils'

import { AccountCreated } from './AccountCreated'

const mockedUseUserProfileInfo = mocked(useUserProfileInfo)
jest.mock('features/home/api')
jest.mock('features/navigation/helpers')

beforeEach(() => {
  mockedUseUserProfileInfo.mockReturnValue({
    data: { isBeneficiary: true },
  } as UseQueryResult<UserProfileResponse>)
  jest.clearAllMocks()
})

describe('<AccountCreated />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AccountCreated />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to cultural survey page WHEN "On y va !" button is clicked', async () => {
    const renderAPI = render(<AccountCreated />)

    const button = await renderAPI.findByText('On y va !')
    fireEvent.press(button)

    expect(navigateToHome).not.toBeCalledTimes(1)
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('CulturalSurvey')
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user is not beneficiary', async () => {
    mockedUseUserProfileInfo.mockReturnValue({
      data: { isBeneficiary: false },
    } as UseQueryResult<UserProfileResponse>)
    const renderAPI = render(<AccountCreated />)

    const button = await renderAPI.findByText('On y va !')
    fireEvent.press(button)

    expect(navigateToHome).toBeCalledTimes(1)
    expect(navigate).not.toBeCalledWith('CulturalSurvey')
  })
})
