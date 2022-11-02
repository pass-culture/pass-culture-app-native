import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { useUserProfileInfo } from 'features/profile/api'
import { ShareAppWrapper } from 'features/shareApp/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/shareApp/helpers/shareAppModalInformations'
import { BatchUser } from 'libs/react-native-batch'
import { render, fireEvent } from 'tests/utils'

import { AccountCreated } from '../AccountCreated'

const mockedUseUserProfileInfo = mocked(useUserProfileInfo)
jest.mock('features/profile/api')
jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

const mockSettings = {
  enableNativeCulturalSurvey: false,
}

jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

const mockShowAppModal = jest.fn()
jest.mock('features/shareApp/context/ShareAppWrapper', () => ({
  ...jest.requireActual('features/shareApp/context/ShareAppWrapper'),
  useShareAppContext: () => ({ showShareAppModal: mockShowAppModal }),
}))

beforeEach(() => {
  mockedUseUserProfileInfo.mockReturnValue({
    data: { needsToFillCulturalSurvey: true },
  } as UseQueryResult<UserProfileResponse>)
})

describe('<AccountCreated />', () => {
  it('should render correctly', () => {
    const renderAPI = renderAccountCreated()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to cultural survey page WHEN "On y va !" button is clicked', async () => {
    const renderAPI = renderAccountCreated()

    fireEvent.press(await renderAPI.findByText('On y va\u00a0!'))

    await waitForExpect(() => {
      expect(navigateFromRef).not.toBeCalledTimes(1)
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('CulturalSurvey', undefined)
    })
  })

  it('should redirect to native cultural survey page WHEN "On y va !" button is clicked when native feature flag is activated', async () => {
    mockSettings.enableNativeCulturalSurvey = true
    const renderAPI = renderAccountCreated()

    fireEvent.press(await renderAPI.findByText('On y va\u00a0!'))

    await waitForExpect(() => {
      expect(navigateFromRef).not.toBeCalled()
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('CulturalSurveyIntro', undefined)
    })
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user needs not to fill cultural survey', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockedUseUserProfileInfo.mockReturnValue({
      data: { needsToFillCulturalSurvey: false },
    } as UseQueryResult<UserProfileResponse>)
    const renderAPI = renderAccountCreated()

    fireEvent.press(await renderAPI.findByText('On y va\u00a0!'))

    await waitForExpect(() => {
      expect(navigateFromRef).toBeCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
      expect(navigate).not.toBeCalledWith('CulturalSurvey', undefined)
    })
  })

  it('should track Batch event when "On y va !" button is clicked', async () => {
    const renderAPI = renderAccountCreated()

    fireEvent.press(await renderAPI.findByText('On y va\u00a0!'))

    expect(BatchUser.trackEvent).toBeCalledWith('has_validated_account')
  })

  it('should show non eligible share app modal when "On y va !" button is clicked', async () => {
    const renderAPI = renderAccountCreated()

    fireEvent.press(await renderAPI.findByText('On y va\u00a0!'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.NOT_ELIGIBLE)
  })
})

const renderAccountCreated = () =>
  render(<AccountCreated />, {
    wrapper: ShareAppWrapper,
  })
