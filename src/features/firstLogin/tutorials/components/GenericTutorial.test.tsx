import AsyncStorage from '@react-native-community/async-storage'
import { act, fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Text, View } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { CardKey } from 'features/firstLogin/tutorials/components/GenericCard'
import { analytics } from 'libs/analytics'

import { GenericTutorial, Props } from './GenericTutorial'

describe('<GenericTutorial />', () => {
  const TestCard = (props: CardKey) => (
    <View>
      <Text>{props.swiperRef ? 'swipeRef exist' : 'swipeRef does not exist'}</Text>
      <Text>{props.name ? 'name exist' : 'name does not exist'}</Text>
    </View>
  )

  it('should render correctly', () => {
    const renderAPI = renderGenericTutorialComponent()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect on home, set has_seen_tutorials in storage and run analytics when pressing skip all button', async () => {
    const name = 'FirstTutorial'
    const { getByText } = renderGenericTutorialComponent({
      name: name,
      children: [<TestCard key={undefined} />],
    })
    const skipAll = await getByText('Tout passer')
    fireEvent.press(skipAll)
    expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
    expect(navigate).toHaveBeenCalledWith('TabNavigator')
    await act(async () => {
      expect(analytics.logHasSkippedTutorial).toHaveBeenCalledWith(`${name}1`)
    })
  })

  it('should have a swiperRef passed to each children', async () => {
    const { getByText } = renderGenericTutorialComponent({
      name: 'FirstTutorial',
      children: [<TestCard key={undefined} />],
    })
    expect(await getByText('swipeRef exist')).toBeTruthy()
    expect(() => getByText('swipeRef does not exist')).toThrow()
  })
  it('should have an automatically set name passed to each children', async () => {
    const { getByText } = renderGenericTutorialComponent({
      name: 'Tuto',
      children: [<TestCard key={undefined} />],
    })
    expect(await getByText('name exist')).toBeTruthy()
    expect(() => getByText('name does not exist')).toThrow()
  })
})

function renderGenericTutorialComponent(props: Props = { name: 'FirstTutorial', children: [] }) {
  return render(<GenericTutorial {...props} />)
}
