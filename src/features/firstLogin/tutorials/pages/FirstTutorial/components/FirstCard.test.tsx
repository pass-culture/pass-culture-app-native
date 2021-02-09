import AsyncStorage from '@react-native-community/async-storage'
import { fireEvent, render } from '@testing-library/react-native'
import React, { createRef } from 'react'
import Swiper from 'react-native-web-swiper'

import { FirstCard } from './FirstCard'

describe('FirstCard', () => {
  it('should render first card', () => {
    const firstTutorial = render(<FirstCard />)
    expect(firstTutorial).toMatchSnapshot()
  })
  it('should swipe to next card on button press', async () => {
    const ref = createRef<Swiper>()
    const { getByText } = render(
      <Swiper ref={ref}>
        <FirstCard swiperRef={ref} />
      </Swiper>
    )
    const button = await getByText('Continuer')
    const goToNext = ref?.current ?? false
    if (goToNext) {
      const spy = jest.spyOn(goToNext, 'goToNext')
      fireEvent.press(button)
      expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
      expect(spy).toHaveBeenCalled()
    }
  })
})
