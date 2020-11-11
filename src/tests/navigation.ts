import { StackScreenProps } from '@react-navigation/stack'

import { HomeStackParamList } from 'features/home/navigation/HomeNavigator'

export const navigationTestProps: StackScreenProps<HomeStackParamList> = {
  route: {
    key: '',
    name: '',
    params: undefined,
  },
  navigation: {
    navigate: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(),
    canGoBack: jest.fn(),
    dangerouslyGetParent: jest.fn(),
    dangerouslyGetState: jest.fn(),
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
