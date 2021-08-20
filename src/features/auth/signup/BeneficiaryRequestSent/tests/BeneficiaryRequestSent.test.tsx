import React from 'react'
import { UseMutationResult, UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse, UserProfileResponse } from 'api/gen'
import * as AuthApi from 'features/auth/api'
import { useAppSettings } from 'features/auth/settings'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { EmptyResponse } from 'libs/fetch'
import { render, fireEvent } from 'tests/utils'

import { BeneficiaryRequestSent } from '../BeneficiaryRequestSent'

const mockedUseAppSettings = mocked(useAppSettings, true)
const mockedUseUserProfileInfo = mocked(useUserProfileInfo)
jest.mock('features/home/api')
jest.mock('react-query')
jest.mock('features/navigation/helpers')
jest.mock('features/auth/settings')

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
      .mockReturnValue({
        mutate: notifyIdCheckCompleted,
      } as unknown as UseMutationResult<EmptyResponse, unknown, void, unknown>)

    render(<BeneficiaryRequestSent />)
    waitForExpect(() => {
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
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseUserProfileInfo.mockReturnValue({
      data: { isBeneficiary: false, needsToFillCulturalSurvey: true },
    } as UseQueryResult<UserProfileResponse>)
    const { findByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(await findByText('On y va !'))

    expect(navigateToHome).toBeCalledTimes(1)
    expect(navigate).not.toBeCalledWith('CulturalSurvey')
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user needs not to fill cultural survey', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseUserProfileInfo.mockReturnValue({
      data: { isBeneficiary: true, needsToFillCulturalSurvey: false },
    } as UseQueryResult<UserProfileResponse>)
    const { findByText } = render(<BeneficiaryRequestSent />)

    fireEvent.press(await findByText('On y va !'))

    expect(navigateToHome).toBeCalledTimes(1)
    expect(navigate).not.toBeCalledWith('CulturalSurvey')
  })

  it('should show specific body message when retention is on and cultural survey is off', async () => {
    const mockedSettings = {
      data: {
        enableIdCheckRetention: true,
      },
      isLoading: false,
    } as UseQueryResult<SettingsResponse, unknown>
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseAppSettings.mockReturnValueOnce(mockedSettings)
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseUserProfileInfo.mockReturnValue({
      data: { isBeneficiary: true, needsToFillCulturalSurvey: false },
    } as UseQueryResult<UserProfileResponse>)
    const { getByText } = render(<BeneficiaryRequestSent />)
    expect(
      getByText(
        "Tu recevras une réponse par e-mail sous 5 jours ouvrés. En attendant, tu peux découvrir l'application !"
      )
    ).toBeDefined()
  })
  it('should show specific body message when retention is on and cultural survey is on', async () => {
    const mockedSettings = {
      data: {
        enableIdCheckRetention: true,
      },
      isLoading: false,
    } as UseQueryResult<SettingsResponse, unknown>
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseAppSettings.mockReturnValueOnce(mockedSettings)
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseUserProfileInfo.mockReturnValue({
      data: { isBeneficiary: true, needsToFillCulturalSurvey: true },
    } as UseQueryResult<UserProfileResponse>)
    const { getByText } = render(<BeneficiaryRequestSent />)
    expect(
      getByText(
        'Tu recevras une réponse par e-mail sous 5 jours ouvrés. En attendant, aide-nous à en savoir plus sur tes pratiques culturelles !'
      )
    ).toBeDefined()
  })
})
