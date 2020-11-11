import { StackScreenProps } from '@react-navigation/stack'
import { render } from '@testing-library/react-native'
import React from 'react'

import { IdCheck } from 'features/cheatcodes/pages/IdCheck'
import { HomeStackParamList } from 'features/home/navigation/HomeNavigator'
import { navigationTestProps } from 'tests/navigation'
describe('IdCheck component', () => {
  it('should render correctly', async () => {
    const instance = render(
      <IdCheck {...(navigationTestProps as StackScreenProps<HomeStackParamList, 'IdCheck'>)} />
    )
    expect(instance).toMatchSnapshot()
  })
})
