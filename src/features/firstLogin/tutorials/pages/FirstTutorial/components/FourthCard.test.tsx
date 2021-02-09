import AsyncStorage from '@react-native-community/async-storage'
import { fireEvent, render } from '@testing-library/react-native'
import React, { createRef } from 'react'
import Swiper from 'react-native-web-swiper'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'

import { FourthCard } from './FourthCard'

describe('FourthCard', () => {
  it('should render fourth card', async () => {
    const firstTutorial = render(<FourthCard />)
    expect(firstTutorial).toMatchSnapshot()
  })
  it('should save has_seen_tutorials in async storage on render', () => {
    render(<FourthCard />)
    expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
  })
  it('should swipe to next card on button press', async () => {
    const ref = createRef<Swiper>()
    const { getByText } = render(
      <Swiper ref={ref}>
        <FourthCard swiperRef={ref} />
      </Swiper>
    )
    const button = await getByText('Découvrir')
    fireEvent.press(button)
    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('TabNavigator')
    })
  })
})
