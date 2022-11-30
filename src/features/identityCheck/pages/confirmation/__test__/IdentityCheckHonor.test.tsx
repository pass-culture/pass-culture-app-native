import mockdate from 'mockdate'
import React from 'react'
import { useMutation } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { amplitude } from 'libs/amplitude'
import { act, fireEvent, render, useMutationFactory, waitFor } from 'tests/utils'

jest.mock('react-query')

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

let mockUserProfile: UserProfileResponse = nonBeneficiaryUser
jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    refetch: jest.fn(() =>
      Promise.resolve({
        data: mockUserProfile,
      })
    ),
  })),
}))

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))
const mockedUseMutation = mocked(useMutation)
const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
  onSuccess: () => {},
  onError: () => {},
}

describe('<IdentityCheckHonor/>', () => {
  beforeEach(() => {
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementation(useMutationFactory(useMutationCallbacks))
  })

  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckHonor />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to next screen on postHonorStatement request success if user is not beneficiary yet', async () => {
    const { getByText } = render(<IdentityCheckHonor />)

    const button = getByText('Valider et continuer')
    fireEvent.press(button)

    await act(async () => {
      useMutationCallbacks.onSuccess()
    })
    await waitForExpect(() => {
      expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to BeneficiaryAccountCreated on postHonorStatement request success if user is beneficiary', async () => {
    mockUserProfile = { ...beneficiaryUser, depositExpirationDate: '2021-12-01T00:00:00.000Z' }

    const { getByText } = render(<IdentityCheckHonor />)

    const button = getByText('Valider et continuer')
    fireEvent.press(button)

    await act(async () => {
      useMutationCallbacks.onSuccess()
    })
    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('BeneficiaryAccountCreated')
    })
  })

  it("should navigate to next Screen if user's credit is expired (non beneficiary)", async () => {
    mockUserProfile = { ...beneficiaryUser, depositExpirationDate: '2020-11-01T00:00:00.000Z' }

    const { getByText } = render(<IdentityCheckHonor />)

    const button = getByText('Valider et continuer')
    fireEvent.press(button)

    await act(async () => {
      useMutationCallbacks.onSuccess()
    })

    await waitForExpect(() => {
      expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
    })
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    render(<IdentityCheckHonor />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_identity_check_honor')
    )
  })
})
