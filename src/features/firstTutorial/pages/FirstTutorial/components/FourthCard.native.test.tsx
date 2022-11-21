import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createRef } from 'react'
import Swiper from 'react-native-web-swiper'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils'

import { FourthCard } from './FourthCard'

const activeAchievementCardProps = {
  index: 0,
  activeIndex: 0,
  lastIndex: 0,
}

const inactiveAchievementCardProps = {
  index: 0,
  activeIndex: 1,
  lastIndex: 1,
}

describe('FourthCard', () => {
  it('should render fourth card', () => {
    const firstTutorial = render(<FourthCard {...activeAchievementCardProps} />)
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should save has_seen_tutorials in async storage when card is active', () => {
    render(<FourthCard {...activeAchievementCardProps} />)
    expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
  })

  it('should NOT save has_seen_tutorials in async storage when card is NOT active', () => {
    render(<FourthCard {...inactiveAchievementCardProps} />)
    expect(AsyncStorage.setItem).not.toBeCalled()
  })

  it('should navigate to OnboardingAuthentication to next card on button press', () => {
    const ref = createRef<Swiper>()
    const { getByText } = render(
      <FourthCard lastIndex={0} activeIndex={0} index={0} swiperRef={ref} />
    )

    fireEvent.press(getByText('Découvrir'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'OnboardingAuthentication')
  })
})
