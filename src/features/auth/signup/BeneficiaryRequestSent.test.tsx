import React from 'react'
import { UseMutationResult, UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import * as AuthApi from 'features/auth/api'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { EmptyResponse } from 'libs/fetch'
import { render, fireEvent, waitFor } from 'tests/utils'

import { BeneficiaryRequestSent } from './BeneficiaryRequestSent'

const mockedUseUserProfileInfo = mocked(useUserProfileInfo)
jest.mock('features/home/api')
jest.mock('react-query')
jest.mock('features/navigation/helpers')

describe('<BeneficiaryRequestSent />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseUserProfileInfo.mockReturnValue({
      data: { isBeneficiary: true, needsToFillCulturalSurvey: true },
    } as UseQueryResult<UserProfileResponse>)
  })

  it('should call notifyIdCheckCompleted inconditonnally', () => {
    const notifyIdCheckCompleted = jest.fn()
    const useNotifyIdCheckCompletedMock = jest
      .spyOn(AuthApi, 'useNotifyIdCheckCompleted')
      .mockReturnValue(({
        mutate: notifyIdCheckCompleted,
      } as unknown) as UseMutationResult<EmptyResponse, unknown, void, unknown>)

    render(<BeneficiaryRequestSent />)
    waitFor(() => {
      expect(notifyIdCheckCompleted).toBeCalled()
    })
    useNotifyIdCheckCompletedMock.mockRestore()
  })

  it('should redirect to cultural survey page WHEN "On y va !" button is clicked', async () => {
    const { findByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(await findByText('On y va !'))

    expect(navigateToHome).not.toBeCalled()
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('CulturalSurvey')
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user is not beneficiary', async () => {
    mockedUseUserProfileInfo.mockReturnValue({
      data: { isBeneficiary: false, needsToFillCulturalSurvey: true },
    } as UseQueryResult<UserProfileResponse>)
    const { findByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(await findByText('On y va !'))

    expect(navigateToHome).toBeCalledTimes(1)
    expect(navigate).not.toBeCalledWith('CulturalSurvey')
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user needs not to fill cultural survey', async () => {
    mockedUseUserProfileInfo.mockReturnValue({
      data: { isBeneficiary: true, needsToFillCulturalSurvey: false },
    } as UseQueryResult<UserProfileResponse>)
    const { findByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(await findByText('On y va !'))

    expect(navigateToHome).toBeCalledTimes(1)
    expect(navigate).not.toBeCalledWith('CulturalSurvey')
  })
})
