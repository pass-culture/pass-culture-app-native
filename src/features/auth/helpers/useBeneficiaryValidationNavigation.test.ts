/* eslint-disable local-rules/no-react-query-provider-hoc */
import { rest } from 'msw'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  IdentityCheckMethod,
  NextSubscriptionStepResponse,
  SubscriptionStep,
  MaintenancePageType,
} from 'api/gen'
import { useBeneficiaryValidationNavigation } from 'features/auth/helpers/useBeneficiaryValidationNavigation'
import { navigateToHome } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, renderHook } from 'tests/utils'

jest.mock('features/navigation/helpers')

jest.mock('features/profile/api/useResetRecreditAmountToShow')

const allowedIdentityCheckMethods = [IdentityCheckMethod.ubble]

describe('useBeneficiaryValidationNavigation', () => {
  it('should navigate to home if nextStep is null', async () => {
    const { result } = renderHook(useBeneficiaryValidationNavigation, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
      initialProps: () => undefined,
    })

    await act(async () => result.current.navigateToNextBeneficiaryValidationStep())

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should navigate to Stepper if nextStep is phone-validation', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['phone-validation'],
      stepperIncludesPhoneValidation: false,
      hasIdentityCheckPending: false,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
      initialProps: () => undefined,
    })

    await act(async () => result.current.navigateToNextBeneficiaryValidationStep())

    expect(navigate).toBeCalledWith('IdentityCheckStepper', undefined)
  })

  it('should navigate to stepper if nextStep is IdentityCheck', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['identity-check'],
      stepperIncludesPhoneValidation: false,
      hasIdentityCheckPending: false,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
      initialProps: () => undefined,
    })

    await act(async () => result.current.navigateToNextBeneficiaryValidationStep())

    expect(navigate).toBeCalledWith('IdentityCheckStepper', undefined)
  })

  it('should navigate to IdentityCheckStepper if nextStep is ProfileCompletion', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['profile-completion'],
      stepperIncludesPhoneValidation: false,
      hasIdentityCheckPending: false,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
      initialProps: () => undefined,
    })

    await act(async () => result.current.navigateToNextBeneficiaryValidationStep())

    expect(navigate).toBeCalledWith('IdentityCheckStepper', undefined)
  })

  it('should navigate to IdentityCheckStepper if nextStep is HonorStatement', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['honor-statement'],
      stepperIncludesPhoneValidation: false,
      hasIdentityCheckPending: false,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
      initialProps: () => undefined,
    })

    await act(async () => result.current.navigateToNextBeneficiaryValidationStep())

    expect(navigate).toBeCalledWith('IdentityCheckStepper', undefined)
  })

  it('should navigate to IdentityCheckUnavailable if nextStep is Maintenance and maintenancePageType is withDMS', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep.maintenance,
      maintenancePageType: MaintenancePageType['with-dms'],
      stepperIncludesPhoneValidation: false,
      hasIdentityCheckPending: false,
    })

    const { result } = renderHook(useBeneficiaryValidationNavigation, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
      initialProps: () => undefined,
    })

    await act(async () => result.current.navigateToNextBeneficiaryValidationStep())

    expect(navigate).toBeCalledWith('IdentityCheckUnavailable', { withDMS: true })
  })
})
it('should navigate to IdentityCheckUnavailable if nextStep is Maintenance and maintenancePageType is not withDMS', async () => {
  mockNextStepRequest({
    allowedIdentityCheckMethods,
    nextSubscriptionStep: SubscriptionStep.maintenance,
    maintenancePageType: MaintenancePageType['without-dms'],
    stepperIncludesPhoneValidation: false,
    hasIdentityCheckPending: false,
  })

  const { result } = renderHook(useBeneficiaryValidationNavigation, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
    initialProps: () => undefined,
  })

  await act(async () => result.current.navigateToNextBeneficiaryValidationStep())

  expect(navigate).toBeCalledWith('IdentityCheckUnavailable', { withDMS: false })
})

function mockNextStepRequest(nextSubscription: NextSubscriptionStepResponse) {
  return server.use(
    rest.get<NextSubscriptionStepResponse>(
      env.API_BASE_URL + `/native/v1/subscription/next_step`,
      (_req, res, ctx) => res.once(ctx.status(200), ctx.json(nextSubscription))
    )
  )
}
