const navigateToNextScreen = jest.fn()
export const useSubscriptionNavigation = jest.fn().mockReturnValue({ navigateToNextScreen })
