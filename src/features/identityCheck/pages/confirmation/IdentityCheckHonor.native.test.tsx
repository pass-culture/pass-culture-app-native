import mockdate from 'mockdate'
import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: mockDispatch,
    confirmation: {
      accepted: true,
    },
  }),
}))

server.use(
  rest.post(env.API_BASE_URL + '/native/v1/subscription/honor_statement', async (_, res, ctx) =>
    res(ctx.status(200))
  )
)

describe('<IdentityCheckHonor/>', () => {
  beforeAll(() => {
    mockUseAuthContext.mockReturnValue({ user: nonBeneficiaryUser })
  })

  it('should render correctly', () => {
    renderIdentityCheckHonor()

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to BeneficiaryRequestSent on postHonorStatement request success if user is not beneficiary yet', async () => {
    renderIdentityCheckHonor()

    const button = screen.getByText('Valider et continuer')
    fireEvent.press(button)

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

    renderIdentityCheckHonor()

    const button = screen.getByText('Valider et continuer')
    fireEvent.press(button)

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

    renderIdentityCheckHonor()

    const button = screen.getByText('Valider et continuer')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('BeneficiaryRequestSent')
    })
  })

  it('should log analytics when the screen is mounted', async () => {
    renderIdentityCheckHonor()

    await waitFor(() => expect(analytics.logScreenViewIdentityCheckHonor).toHaveBeenCalledTimes(1))
  })
})

const renderIdentityCheckHonor = () => {
  return render(reactQueryProviderHOC(<IdentityCheckHonor />))
}
