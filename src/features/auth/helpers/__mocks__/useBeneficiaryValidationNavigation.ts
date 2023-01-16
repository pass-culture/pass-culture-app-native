const navigateToNextBeneficiaryValidationStep = jest.fn()
export const useBeneficiaryValidationNavigation = jest.fn().mockReturnValue({
  nextBeneficiaryValidationStepNavConfig: { screen: '', params: undefined },
  navigateToNextBeneficiaryValidationStep,
})
