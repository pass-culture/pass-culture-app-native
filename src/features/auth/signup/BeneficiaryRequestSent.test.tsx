import React from 'react'
import { UseMutationResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import * as AuthApi from 'features/auth/api'
import { EmptyResponse } from 'libs/fetch'
import { render, fireEvent, waitFor } from 'tests/utils'

import { BeneficiaryRequestSent } from './BeneficiaryRequestSent'

jest.mock('react-query')

describe('<BeneficiaryRequestSent />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should call notifyIdCheckCompleted inconditonnally', () => {
    const notifyIdCheckCompleted = jest.fn()
    const useNotifyIdCheckCompletedMock = jest
      .spyOn(AuthApi, 'useNotifyIdCheckCompleted')
      .mockReturnValue(({
        mutate: notifyIdCheckCompleted,
      } as unknown) as UseMutationResult<EmptyResponse, unknown, void, unknown>)

    waitFor(() => {
      expect(notifyIdCheckCompleted).toBeCalled()
    })
    useNotifyIdCheckCompletedMock.mockRestore()
  })
  it('should redirect to cultural survey page WHEN "On y va !" button is clicked', async () => {
    const { findByText } = render(<BeneficiaryRequestSent />)

    const button = await findByText('On y va !')
    fireEvent.press(button)

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('CulturalSurvey')
  })
})
