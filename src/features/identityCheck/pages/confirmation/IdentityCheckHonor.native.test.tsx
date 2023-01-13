import mockdate from 'mockdate'
import React from 'react'
import { useMutation } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { amplitude } from 'libs/amplitude'
import { act, fireEvent, render, useMutationFactory, waitFor } from 'tests/utils'

jest.mock('react-query')

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

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
  beforeAll(() => {
    mockUseAuthContext.mockReturnValue({ user: nonBeneficiaryUser })
  })
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
    const user = {
      ...beneficiaryUser,
      depositExpirationDate: '2021-12-01T00:00:00.000Z',
    }
    mockUseAuthContext.mockReturnValueOnce({
      user,
      refetchUser: async () => ({ data: user }),
    })

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
    const user = { ...beneficiaryUser, depositExpirationDate: '2020-11-01T00:00:00.000Z' }
    mockUseAuthContext.mockReturnValueOnce({
      user,
      refetchUser: async () => ({ data: user }),
    })

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
