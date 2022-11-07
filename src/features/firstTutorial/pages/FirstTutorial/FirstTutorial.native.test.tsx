import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const firstTutorial = render(reactQueryProviderHOC(<FirstTutorial {...props} />))
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should set has_seen_tutorials in storage on skip', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByText } = render(reactQueryProviderHOC(<FirstTutorial {...props} />))

    fireEvent.press(getByText('Tout passer'))
    expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
  })
})
