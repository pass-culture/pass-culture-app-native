import { NavigationContainer } from '@react-navigation/native'
import { act, render } from '@testing-library/react-native'
import React from 'react'

import { RootStack } from 'features/navigation/RootNavigator'
import { flushAllPromises } from 'tests/utils'

import { Offer } from './Offer'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

describe('<Offer />', () => {
  it('should match snapshot', async () => {
    const { toJSON, getByTestId } = await renderOfferPage()
    expect(toJSON()).toMatchSnapshot()
    expect(getByTestId('offerId').props.children).toBe('ABCDE')
  })
})

async function renderOfferPage() {
  const wrapper = render(
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Offer">
        <RootStack.Screen name="Offer" component={Offer} initialParams={{ offerId: 'ABCDE' }} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}
