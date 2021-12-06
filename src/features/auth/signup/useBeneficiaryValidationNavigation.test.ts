import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  IdentityCheckMethod,
  NextSubscriptionStepResponse,
  SettingsResponse,
  SubscriptionStep,
} from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { navigateToHome } from 'features/navigation/helpers'
import { useIsUserUnderage } from 'features/profile/utils'
import { env } from 'libs/environment'
import { server } from 'tests/server'

jest.mock('features/navigation/helpers')
jest.mock('features/auth/settings')
jest.mock('features/home/api')
jest.mock('features/profile/utils')
jest.mock('libs/firestore/ubbleLoad', () => ({ useIsUnderUbbleLoadThreshold: jest.fn(() => true) }))
const mockedUseAppSettings = mocked(useAppSettings)
const mockedUseIsUserUnderage = mocked(useIsUserUnderage)

const allowedIdentityCheckMethods = [IdentityCheckMethod.Jouve]

describe('useBeneficiaryValidationNavigation', () => {
  it('should navigate to home if nextStep is null', async () => {
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalled()
    })
  })

  it('should navigate to UnavailableEduConnect if nextStep is null and user is underage', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigateToHome).not.toHaveBeenCalled()
      expect(navigate).toBeCalledWith('UnavailableEduConnect')
    })
  })

  it('should navigate to PhoneValidation if nextStep is phone-validation', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep.PhoneValidation,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('SetPhoneNumber')
    })
  })

  it('should navigate to IdCheck if nextStep is identity-check', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep.IdentityCheck,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdCheckV2')
    })
  })

  it('should navigate to IdCheck if nextStep is profile-completion and ubble not allowed', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep.ProfileCompletion,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdCheckV2')
    })
  })

  it('should navigate to IdentityCheck if nextStep is profile-completion and ubble allowed', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods: [IdentityCheckMethod.Ubble, IdentityCheckMethod.Jouve],
      nextSubscriptionStep: SubscriptionStep.ProfileCompletion,
    })
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdentityCheck')
    })
  })

  it('should navigate to IdCheckUnavailable if nextStep is identity-check and allowIdCheckRegistration is false', async () => {
    const mockedSettings = {
      data: { allowIdCheckRegistration: true },
      isLoading: false,
    } as UseQueryResult<SettingsResponse, unknown>
    mockedUseAppSettings.mockReturnValueOnce(mockedSettings)

    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep.IdentityCheck,
    })

    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdCheckV2')
    })
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
