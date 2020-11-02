import { StackScreenProps } from '@react-navigation/stack'
import { render } from '@testing-library/react-native'
import React from 'react'

import { IdCheck } from 'features/cheatcodes/pages/IdCheck'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { navigationTestProps } from 'tests/navigation'

describe('IdCheck component', () => {
  it('should render correctly', async () => {
    const instance = render(
      <IdCheck {...(navigationTestProps as StackScreenProps<RootStackParamList, 'IdCheck'>)} />
    )
    expect(instance).toMatchSnapshot()
  })
})
