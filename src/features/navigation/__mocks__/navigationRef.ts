import { navigationRef as actualNavigationRef } from '../navigationRef'

export const navigationRef: typeof actualNavigationRef = {
    current: {
        addListener: jest.fn(),
        canGoBack: jest.fn(),
        dangerouslyGetParent: jest.fn(),
        dangerouslyGetState: jest.fn(),
        dispatch: jest.fn(),
        emit: jest.fn(),
        getCurrentOptions: jest.fn(),
        getCurrentRoute: jest.fn(), 
        getRootState: jest.fn(), 
        goBack: jest.fn(),
        isFocused: jest.fn(),
        navigate: jest.fn(),
        removeListener: jest.fn(),
        reset: jest.fn(),
        resetRoot: jest.fn(), 
        setParams: jest.fn(),
    }
}
