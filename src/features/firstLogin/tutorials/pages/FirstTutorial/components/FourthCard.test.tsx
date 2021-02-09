import AsyncStorage from '@react-native-community/async-storage'
import { fireEvent, render } from '@testing-library/react-native'
import React, { createRef } from 'react'
import Swiper from 'react-native-web-swiper'

import { navigate } from '__mocks__/@react-navigation/native'

import { FourthCard } from './FourthCard'

describe('FourthCard', () => {
  it('should render fourth card', () => {
    const firstTutorial = render(<FourthCard />)
    expect(firstTutorial).toMatchSnapshot()
  })
  it('should save has_seen_tutorials in async storage on render', () => {
    render(<FourthCard />)
    expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
  })
  it('should swipe to next card on button press', async () => {
    const ref = createRef<Swiper>()
    const { getByText } = render(<FourthCard swiperRef={ref} />)
    const button = await getByText('Découvrir')
    fireEvent.press(button)
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('TabNavigator')
  })
})
