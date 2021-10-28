import { renderHook } from '@testing-library/react-hooks'

import { navigate } from '__mocks__/@react-navigation/native'
import { BeneficiaryValidationStep } from 'api/gen'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { navigateToHome } from 'features/navigation/helpers'
import { flushAllPromises } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('features/auth/settings')

let mockData: unknown = null
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    refetch: jest.fn(() => Promise.resolve({ data: mockData })),
  })),
}))

describe('useBeneficiaryValidationNavigation', () => {
  beforeEach(jest.clearAllMocks)

  it('should navigate to home if user is undefined', async () => {
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await flushAllPromises()

    expect(navigateToHome).toBeCalled()
  })

  it('should navigate to home if user.nextBeneficiaryValidationStep is null', async () => {
    mockData = { firstName: 'Christophe', lastName: 'Dupont' }
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await flushAllPromises()

    expect(navigateToHome).toBeCalled()
  })

  it('should navigate to PhoneValidation if user.nextBeneficiaryValidationStep is phone-validation', async () => {
    mockData = {
      firstName: 'Christophe',
      lastName: 'Dupont',
      nextBeneficiaryValidationStep: 'phone-validation',
    }
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await flushAllPromises()

    expect(navigate).toBeCalledWith('SetPhoneNumber')
  })

  it('should navigate to IdCheck if user.nextBeneficiaryValidationStep is undefined', async () => {
    mockData = {
      firstName: 'Christophe',
      lastName: 'Dupont',
      nextBeneficiaryValidationStep: 'id-check',
      email: 'christophe.dupont@gmail.com',
    }

    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep()

    await flushAllPromises()

    expect(navigate).toBeCalledWith('IdCheckV2')
  })

  it('should navigate to IdCheck if prefetched next step is id-check and email is not null', () => {
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep({
      nextBeneficiaryValidationStep: BeneficiaryValidationStep.IdCheck,
    })

    expect(navigate).toBeCalledWith('IdCheckV2')
  })

  it('should navigate to IdCheck if prefetched next step is beneficiary-information and email is not null', () => {
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep({
      nextBeneficiaryValidationStep: BeneficiaryValidationStep.BeneficiaryInformation,
    })

    expect(navigate).toBeCalledWith('IdCheckV2')
  })

  it('should navigate to IdCheck if prefetched next step is id-check and email is not null', () => {
    const { result } = renderHook(useBeneficiaryValidationNavigation)
    result.current.navigateToNextBeneficiaryValidationStep({
      nextBeneficiaryValidationStep: BeneficiaryValidationStep.PhoneValidation,
    })

    expect(navigate).toBeCalledWith('SetPhoneNumber')
  })
})
