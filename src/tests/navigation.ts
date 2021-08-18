import { StackScreenProps } from '@react-navigation/stack'

import { RootStackParamList } from 'features/navigation/RootNavigator'

export const navigationTestProps: StackScreenProps<RootStackParamList> = {
  route: {
    key: '',
    name: 'AcceptCgu',
    params: undefined,
  },
  navigation: {
    navigate: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(),
    canGoBack: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    replace: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
  },
}
