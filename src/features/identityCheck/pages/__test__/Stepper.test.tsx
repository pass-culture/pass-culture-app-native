import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  IdentityCheckMethod,
  NextSubscriptionStepResponse,
  SubscriptionStep,
  UserProfileResponse,
} from 'api/gen'
import { IdentityCheckStepper } from 'features/identityCheck/pages/Stepper'
import { render, superFlushWithAct } from 'tests/utils'

let mockNextSubscriptionStep: NextSubscriptionStepResponse = {
  allowedIdentityCheckMethods: [IdentityCheckMethod.ubble, IdentityCheckMethod.educonnect],
  nextSubscriptionStep: SubscriptionStep['identity-check'],
  hasIdentityCheckPending: false,
  stepperIncludesPhoneValidation: false,
}
const mockIdentityCheckDispatch = jest.fn()

jest.mock('features/auth/signup/nextSubscriptionStep', () => ({
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
      screens: ['IdentityCheckStart', 'IdentityCheckWebview', 'IdentityCheckEnd'],
    },
  ]),
}))
jest.mock('react-query')

describe('Stepper navigation', () => {
  beforeEach(jest.clearAllMocks)
  it('should navigate to UnderageAccountCreated when next_step is null and initialCredit is lower than 300 euros', async () => {
    mockNextSubscriptionStep = {
      allowedIdentityCheckMethods: [IdentityCheckMethod.ubble],
      nextSubscriptionStep: null,
      hasIdentityCheckPending: false,
      stepperIncludesPhoneValidation: false,
    }
    render(<IdentityCheckStepper />)
    await superFlushWithAct()
    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledWith('UnderageAccountCreated')
    })
  })
  it('should navigate to AccountCreated when next_step is null and initialCredit is 300 euros', async () => {
    mockNextSubscriptionStep = {
      allowedIdentityCheckMethods: [IdentityCheckMethod.ubble],
      nextSubscriptionStep: null,
      hasIdentityCheckPending: false,
      stepperIncludesPhoneValidation: false,
    }
    mockUserProfileData = {
      ...mockUserProfileData,
      domainsCredit: { all: { initial: 30000, remaining: 30000 } },
    }
    render(<IdentityCheckStepper />)
    await superFlushWithAct()
    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledWith('AccountCreated')
    })
  })
  it('should stay on stepper when next_step is null initialCredit is not between 0 and 300 euros', async () => {
    mockNextSubscriptionStep = {
      allowedIdentityCheckMethods: [IdentityCheckMethod.ubble],
      nextSubscriptionStep: null,
      hasIdentityCheckPending: false,
      stepperIncludesPhoneValidation: false,
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
})
