const navigateToNextBeneficiaryValidationStep = jest.fn()
export const useBeneficiaryValidationNavigation = jest
  .fn()
  .mockReturnValue({ error: null, navigateToNextBeneficiaryValidationStep })
