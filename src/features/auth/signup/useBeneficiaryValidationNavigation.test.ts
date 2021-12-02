import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { NextSubscriptionStepResponse, SettingsResponse, SubscriptionStep } from 'api/gen'
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
jest.mock('libs/firestore/ubbleLoad', () => ({ useSendToUbble: jest.fn(() => true) }))
const mockedUseAppSettings = mocked(useAppSettings)
const mockedUseIsUserUnderage = mocked(useIsUserUnderage)

describe('useBeneficiaryValidationNavigation', () => {
  it('should navigate to home if nextStep is null', () => {
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    waitForExpect(() => {
      expect(navigateToHome).toBeCalled()
    })
  })

  it('should navigate to UnavailableEduConnect if nextStep is null and user is underage', () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    waitForExpect(() => {
      expect(navigateToHome).not.toHaveBeenCalled()
      expect(navigate).toBeCalledWith('UnavailableEduConnect')
    })
  })

  it('should navigate to PhoneValidation if nextStep is phone-validation', () => {
    mockNextStepRequest(SubscriptionStep.PhoneValidation)
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    waitForExpect(() => {
      expect(navigate).toBeCalledWith('SetPhoneNumber')
    })
  })

  it('should navigate to IdCheck if nextStep is identity-check', () => {
    mockNextStepRequest(SubscriptionStep.IdentityCheck)
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdCheckV2')
    })
  })

  it('should navigate to IdCheck if nextStep is profile-completion', () => {
    mockNextStepRequest(SubscriptionStep.ProfileCompletion)
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdCheckV2')
    })
  })

  it('should navigate to IdCheckUnavailable if nextStep is identity-check and allowIdCheckRegistration is false', () => {
    const mockedSettings = {
      data: {
        allowIdCheckRegistration: true,
      },
      isLoading: false,
    } as UseQueryResult<SettingsResponse, unknown>
    mockedUseAppSettings.mockReturnValueOnce(mockedSettings)

    mockNextStepRequest(SubscriptionStep.IdentityCheck)

    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdCheckV2')
    })
  })
})

function mockNextStepRequest(nextSubscriptionStep: SubscriptionStep) {
  return server.use(
    rest.get<NextSubscriptionStepResponse>(
      env.API_BASE_URL + `/native/v1/subscription/next_step`,
      (_req, res, ctx) => res.once(ctx.status(200), ctx.json({ nextSubscriptionStep }))
    )
  )
}
