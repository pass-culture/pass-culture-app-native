import { StackScreenProps } from '@react-navigation/stack'

import { RootStackParamList } from 'features/navigation/RootNavigator'

export const navigationTestProps: StackScreenProps<RootStackParamList> = {
  route: {
    key: '',
    name: 'TabNavigator',
    params: undefined,
  },
  navigation: {
    addListener: jest.fn(),
    canGoBack: jest.fn(),
    dispatch: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(),
    navigate: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
    push: jest.fn(),
    removeListener: jest.fn(),
    replace: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn(),
    setParams: jest.fn(),
  },
}
