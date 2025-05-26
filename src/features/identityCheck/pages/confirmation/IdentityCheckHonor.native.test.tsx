import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/jwt/jwt')
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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('<IdentityCheckHonor/>', () => {
  beforeAll(() => {
    mockAuthContextWithUser(nonBeneficiaryUser, { persist: true })
  })

  beforeEach(() => {
    mockdate.set(new Date('2020-12-01T00:00:00.000Z'))
    mockServer.postApi('/v1/subscription/honor_statement', {})
  })

  it('should render correctly', () => {
    renderIdentityCheckHonor()

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to BeneficiaryRequestSent on postHonorStatement request success if user is not beneficiary yet', async () => {
    renderIdentityCheckHonor()

    await user.press(screen.getByText('Valider et continuer'))

    expect(navigate).toHaveBeenCalledWith('BeneficiaryRequestSent')
  })

  it('should navigate to BeneficiaryAccountCreated on postHonorStatement request success if user is beneficiary', async () => {
    const currentUser = {
      ...beneficiaryUser,
      depositExpirationDate: '2021-12-01T00:00:00.000Z',
    }
    mockUseAuthContext.mockReturnValueOnce({
      user,
      refetchUser: async () => ({ data: currentUser }),
    })

    renderIdentityCheckHonor()

    await user.press(screen.getByText('Valider et continuer'))

    expect(navigate).toHaveBeenCalledWith('BeneficiaryAccountCreated')
  })

  it("should navigate to BeneficiaryRequestSent if user's credit is expired (non beneficiary)", async () => {
    const currentUser = { ...beneficiaryUser, depositExpirationDate: '2020-11-01T00:00:00.000Z' }
    mockUseAuthContext.mockReturnValueOnce({
      user,
      refetchUser: async () => ({ data: currentUser }),
    })

    renderIdentityCheckHonor()

    await user.press(screen.getByText('Valider et continuer'))

    expect(navigate).toHaveBeenCalledWith('BeneficiaryRequestSent')
  })
})

const renderIdentityCheckHonor = () => {
  return render(reactQueryProviderHOC(<IdentityCheckHonor />))
}
