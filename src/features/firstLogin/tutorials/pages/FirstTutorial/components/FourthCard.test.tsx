import AsyncStorage from '@react-native-community/async-storage'
import { fireEvent, render } from '@testing-library/react-native'
import React, { createRef } from 'react'
import Swiper from 'react-native-web-swiper'

import { navigate } from '__mocks__/@react-navigation/native'

import { FourthCard } from './FourthCard'

const activeCardProps = {
  index: 0,
  activeIndex: 0,
}

const inactiveCardProps = {
  index: 0,
  activeIndex: 1,
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('FourthCard', () => {
  it('should render fourth card', () => {
    const firstTutorial = render(<FourthCard {...activeCardProps} />)
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should save has_seen_tutorials in async storage when card is active', () => {
    render(<FourthCard {...activeCardProps} />)
    expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
  })

  it('should NOT save has_seen_tutorials in async storage when card is NOT active', () => {
    render(<FourthCard {...inactiveCardProps} />)
    expect(AsyncStorage.setItem).not.toBeCalled()
  })

  it('should swipe to next card on button press', () => {
    const ref = createRef<Swiper>()
    const { getByText } = render(<FourthCard swiperRef={ref} />)

    fireEvent.press(getByText('Découvrir'))

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('TabNavigator')
  })
})
