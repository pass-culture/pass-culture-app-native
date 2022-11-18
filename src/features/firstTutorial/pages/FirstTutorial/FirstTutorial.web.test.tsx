import { StackScreenProps } from '@react-navigation/stack'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils/web'

import { FirstTutorial } from './FirstTutorial'

const props = {
  route: {
    name: 'FirstTutorial',
    key: 'key',
    params: { shouldCloseAppOnBackAction: false },
  },
} as StackScreenProps<RootStackParamList, 'FirstTutorial'>

describe('FirstTutorial page', () => {
  it('should reset navigation on skip', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByText } = render(reactQueryProviderHOC(<FirstTutorial {...props} />))

    await userEvent.click(getByText('Tout passer'))
    expect(reset).toHaveBeenNthCalledWith(1, { index: 0, routes: [{ name: homeNavConfig[0] }] })
  })
})
