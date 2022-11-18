import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { FirstTutorial } from './FirstTutorial'

const props = {
  route: {
    name: 'FirstTutorial',
    key: 'key',
    params: { shouldCloseAppOnBackAction: false },
  },
} as StackScreenProps<RootStackParamList, 'FirstTutorial'>

describe('FirstTutorial page', () => {
  it('should render first tutorial', () => {
    const firstTutorial = renderFirstTutorial()
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should set has_seen_tutorials in storage on skip', () => {
    const { getByText } = renderFirstTutorial()

    fireEvent.press(getByText('Tout passer'))
    expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
  })

  it('should navigate to OnBoardingAuthentication on skip', () => {
    const { getByText } = renderFirstTutorial()

    fireEvent.press(getByText('Tout passer'))
    expect(navigate).toHaveBeenNthCalledWith(1, 'OnboardingAuthentication')
  })
})

const renderFirstTutorial = () =>
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  render(reactQueryProviderHOC(<FirstTutorial {...props} />))
