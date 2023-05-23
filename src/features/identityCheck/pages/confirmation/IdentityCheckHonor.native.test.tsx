import mockdate from 'mockdate'
import React from 'react'
import { useMutation } from 'react-query'

import { dispatch, navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, useMutationFactory, waitFor, screen } from 'tests/utils'

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: mockDispatch,
  })),
}))

jest.mock('react-query')

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

const mockedUseMutation = jest.mocked(useMutation)
const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
  onSuccess: () => {},
  onError: () => {},
}

describe('<IdentityCheckHonor/>', () => {
  beforeAll(() => {
    mockUseAuthContext.mockReturnValue({ user: beneficiaryUser })
  })
  beforeEach(() => {
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementation(useMutationFactory(useMutationCallbacks))
  })

  it('should render correctly', () => {
    renderIdentityCheckHonor()
    expect(screen).toMatchSnapshot()
  })

  it('should navigate to next screen on request success if user is not beneficiary yet', async () => {
    const user = {
      ...nonBeneficiaryUser,
    }
    mockUseAuthContext.mockReturnValueOnce({
      user,
      refetchUser: async () => ({ data: user }),
    })

    renderIdentityCheckHonor()

    const button = screen.getByText('Valider et continuer')
    fireEvent.press(button)

    useMutationCallbacks.onSuccess()

    expect(screen.getByText('Valider et continuer')).toBeTruthy()

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to BeneficiaryAccountCreated on request success if user is beneficiary', async () => {
    const user = {
      ...beneficiaryUser,
      depositExpirationDate: '2021-12-01T00:00:00.000Z',
    }
    mockUseAuthContext.mockReturnValueOnce({
      user,
      refetchUser: async () => ({ data: user }),
    })

    renderIdentityCheckHonor()

    const button = screen.getByText('Valider et continuer')
    fireEvent.press(button)

    useMutationCallbacks.onSuccess()

    expect(screen.getByText('Valider et continuer')).toBeTruthy()

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'BeneficiaryAccountCreated')
    })
  })

  it('should log analytics when the screen is mounted', async () => {
    renderIdentityCheckHonor()

    await waitFor(() => expect(analytics.logScreenViewIdentityCheckHonor).toHaveBeenCalledTimes(1))
  })
})

function renderIdentityCheckHonor() {
  return render(<IdentityCheckHonor />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
