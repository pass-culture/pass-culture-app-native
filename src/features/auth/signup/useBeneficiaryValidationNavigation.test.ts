import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  IdentityCheckMethod,
  NextSubscriptionStepResponse,
  SubscriptionStep,
  MaintenancePageType,
} from 'api/gen'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { UserProfiling } from 'features/auth/signup/UserProfiling'
import { navigateToHome } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { UserProfilingError } from 'libs/monitoring/errors'
import { server } from 'tests/server'

jest.mock('features/navigation/helpers')
jest.mock('features/auth/settings')
jest.mock('features/home/api')
jest.mock('features/profile/utils')

const allowedIdentityCheckMethods = [IdentityCheckMethod.ubble]

describe('useBeneficiaryValidationNavigation', () => {
  it('should navigate to home if nextStep is null', async () => {
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalled()
    })
  })

  it('should navigate to PhoneValidation if nextStep is phone-validation', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['phone-validation'],
      hasIdentityCheckPending: false,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('SetPhoneNumber')
    })
  })

  it('should navigate to stepper if nextStep is IdentityCheck', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['identity-check'],
      hasIdentityCheckPending: false,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdentityCheckStepper')
    })
  })

  it('should set UserProfilingError if nextStep is user-profiling', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['user-profiling'],
      hasIdentityCheckPending: false,
    })

    const setError = jest.fn()
    const { result } = renderHook(() => useBeneficiaryValidationNavigation(setError))
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(setError).toBeCalledWith(
        new UserProfilingError("SubscriptionStep['user-profiling']", UserProfiling)
      )
    })
  })

  it('should navigate to IdentityCheckStepper if nextStep is ProfileCompletion', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['profile-completion'],
      hasIdentityCheckPending: false,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdentityCheckStepper')
    })
  })

  it('should navigate to IdentityCheckStepper if nextStep is HonorStatement', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['honor-statement'],
      hasIdentityCheckPending: false,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdentityCheckStepper')
    })
  })

  it('should navigate to IdentityCheckUnavailable if nextStep is Maintenance and maintenancePageType is withDMS', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep.maintenance,
      maintenancePageType: MaintenancePageType['with-dms'],
      hasIdentityCheckPending: false,
    })

    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdentityCheckUnavailable', { withDMS: true })
    })
  })
})
it('should navigate to IdentityCheckUnavailable if nextStep is Maintenance and maintenancePageType is not withDMS', async () => {
  mockNextStepRequest({
    allowedIdentityCheckMethods,
    nextSubscriptionStep: SubscriptionStep.maintenance,
    maintenancePageType: MaintenancePageType['without-dms'],
    hasIdentityCheckPending: false,
  })

  const { result } = renderHook(useBeneficiaryValidationNavigation)
  result.current.navigateToNextBeneficiaryValidationStep()

  await waitForExpect(() => {
    expect(navigate).toBeCalledWith('IdentityCheckUnavailable', { withDMS: false })
  })
})

function mockNextStepRequest(nextSubscription: NextSubscriptionStepResponse) {
  return server.use(
    rest.get<NextSubscriptionStepResponse>(
      env.API_BASE_URL + `/native/v1/subscription/next_step`,
      (_req, res, ctx) => res.once(ctx.status(200), ctx.json(nextSubscription))
    )
  )
}
