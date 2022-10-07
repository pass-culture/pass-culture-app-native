import mockdate from 'mockdate'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { nextSubscriptionStepFixture as mockStep } from 'features/identityCheck/__mocks__/nextSubscriptionStepFixture'
import { IdentityCheckStepper } from 'features/identityCheck/pages/Stepper'
import { render, superFlushWithAct } from 'tests/utils'

let mockNextSubscriptionStep = mockStep
const mockIdentityCheckDispatch = jest.fn()

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

jest.mock('features/auth/signup/useNextSubscriptionStep', () => ({
  useNextSubscriptionStep: jest.fn(() => ({
    data: mockNextSubscriptionStep,
  })),
}))
jest.mock('features/identityCheck/useSetCurrentSubscriptionStep', () => ({
  useSetSubscriptionStepAndMethod: jest.fn(() => ({
    subscription: mockNextSubscriptionStep,
  })),
}))

let mockUserProfileData: Partial<UserProfileResponse> = {
  email: 'christophe.dupont@example.com',
  firstName: 'Christophe',
  lastName: 'Dupont',
  domainsCredit: { all: { initial: 3000, remaining: 3000 } },
}

jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    refetch: jest.fn(() =>
      Promise.resolve({
        data: mockUserProfileData,
      })
    ),
  })),
}))
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))
jest.mock('features/identityCheck/useIdentityCheckSteps', () => ({
  useIdentityCheckSteps: jest.fn(() => [
    {
      name: 'IdentityCheckStep.IDENTIFICATION',
      label: 'Identification',
      icon: 'Icon',
      screens: ['IdentityCheckStart', 'UbbleWebview', 'IdentityCheckEnd'],
    },
  ]),
}))
jest.mock('react-query')

describe('Stepper navigation', () => {
  beforeEach(jest.clearAllMocks)

  it('should stay on stepper when next_step is null and initialCredit is not between 0 and 300 euros', async () => {
    mockNextSubscriptionStep = {
      ...mockStep,
      nextSubscriptionStep: null,
    }
    mockUserProfileData = {
      ...mockUserProfileData,
      // @ts-expect-error we test the case where we don't have credit returned
      domainsCredit: {},
    }
    render(<IdentityCheckStepper />)
    await superFlushWithAct()
    await waitForExpect(() => {
      expect(navigate).not.toHaveBeenCalled()
    })
  })

  it('should navigate to BeneficiaryAccountCreated when next_step is null and initialCredit is available', async () => {
    mockNextSubscriptionStep = {
      ...mockStep,
      nextSubscriptionStep: null,
    }
    mockUserProfileData = {
      ...mockUserProfileData,
      depositExpirationDate: '2021-11-01T00:00:00.000Z',
      domainsCredit: { all: { initial: 30000, remaining: 30000 } },
    }
    render(<IdentityCheckStepper />)
    await superFlushWithAct()
    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledWith('BeneficiaryAccountCreated')
    })
  })
})
