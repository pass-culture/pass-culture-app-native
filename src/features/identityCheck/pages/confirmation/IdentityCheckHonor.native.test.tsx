import mockdate from 'mockdate'
import React from 'react'
import { useMutation } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { fireEvent, render, useMutationFactory, waitFor, screen } from 'tests/utils'

jest.mock('react-query')

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

const mockedUseMutation = jest.mocked(useMutation)
const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
  onSuccess: () => {},
  onError: () => {},
}

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: mockDispatch,
    confirmation: {
      accepted: true,
    },
  }),
}))

describe('<IdentityCheckHonor/>', () => {
  beforeAll(() => {
    mockUseAuthContext.mockReturnValue({ user: nonBeneficiaryUser })
  })
  beforeEach(() => {
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementation(useMutationFactory(useMutationCallbacks))
  })

  it('should render correctly', () => {
    render(<IdentityCheckHonor />)
    expect(screen).toMatchSnapshot()
  })

  it('should navigate to BeneficiaryRequestSent on postHonorStatement request success if user is not beneficiary yet', async () => {
    render(<IdentityCheckHonor />)

    const button = screen.getByText('Valider et continuer')
    fireEvent.press(button)

    useMutationCallbacks.onSuccess()

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('BeneficiaryRequestSent')
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

    render(<IdentityCheckHonor />)

    const button = screen.getByText('Valider et continuer')
    fireEvent.press(button)

    useMutationCallbacks.onSuccess()

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('BeneficiaryAccountCreated')
    })
  })

  it("should navigate to BeneficiaryRequestSent if user's credit is expired (non beneficiary)", async () => {
    const user = { ...beneficiaryUser, depositExpirationDate: '2020-11-01T00:00:00.000Z' }
    mockUseAuthContext.mockReturnValueOnce({
      user,
      refetchUser: async () => ({ data: user }),
    })

    render(<IdentityCheckHonor />)

    const button = screen.getByText('Valider et continuer')
    fireEvent.press(button)

    useMutationCallbacks.onSuccess()

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('BeneficiaryRequestSent')
    })
  })

  it('should log analytics when the screen is mounted', async () => {
    render(<IdentityCheckHonor />)

    await waitFor(() => expect(analytics.logScreenViewIdentityCheckHonor).toHaveBeenCalledTimes(1))
  })
})
