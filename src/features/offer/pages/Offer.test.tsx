import { NavigationContainer } from '@react-navigation/native'
import { act, render } from '@testing-library/react-native'
import React from 'react'

import { RootStack } from 'features/navigation/RootNavigator'
import { AlgoliaHit } from 'libs/algolia'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { flushAllPromises } from 'tests/utils'

import { Offer } from './Offer'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
const defaultAlgoliaHit: AlgoliaHit = mockedAlgoliaResponse.hits[0]

describe('<Offer />', () => {
  it('should match snapshot', async () => {
    const { toJSON, getByTestId } = await renderOfferPage()
    expect(toJSON()).toMatchSnapshot()
    expect(getByTestId('offerId').props.children).toBe('ABCDE')
  })
})

async function renderOfferPage(algoliaHit?: AlgoliaHit) {
  const wrapper = render(
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Offer">
        <RootStack.Screen
          name="Offer"
          component={Offer}
          initialParams={{ id: 'ABCDE', algoliaHit: algoliaHit ?? defaultAlgoliaHit }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}
