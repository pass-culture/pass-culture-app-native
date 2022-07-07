import { navigationRef as actualNavigationRef } from '../navigationRef'

export const navigationRef: typeof actualNavigationRef = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  emit: jest.fn(),
  getCurrentOptions: jest.fn(),
  getCurrentRoute: jest.fn(),
  getParent: jest.fn(),
  getRootState: jest.fn(),
  getState: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(),
  isReady: jest.fn(),
  navigate: jest.fn(),
  removeListener: jest.fn(),
  reset: jest.fn(),
  resetRoot: jest.fn(),
  setParams: jest.fn(),
  current: null,
}

export const navigateFromRef = jest.fn()
export const pushFromRef = jest.fn()
export const canGoBackFromRef = jest.fn()
export const goBackFromRef = jest.fn()
