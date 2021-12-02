const navigateToNextScreen = jest.fn()
export const useIdentityCheckNavigation = jest.fn().mockReturnValue({ navigateToNextScreen })
