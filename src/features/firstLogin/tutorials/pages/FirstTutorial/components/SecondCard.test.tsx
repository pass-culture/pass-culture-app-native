import { fireEvent, render } from '@testing-library/react-native'
import React, { createRef } from 'react'
import Swiper from 'react-native-web-swiper'

import { SecondCard } from './SecondCard'

describe('SecondCard', () => {
  it('should render second card', () => {
    const firstTutorial = render(<SecondCard />)
    expect(firstTutorial).toMatchSnapshot()
  })
  it('should swipe to next card on button press', async () => {
    const ref = createRef<Swiper>()
    const { getByText } = render(<SecondCard swiperRef={ref} />)
    const button = await getByText('Continuer')
    const goToNext = ref?.current ?? false
    if (goToNext) {
      const spy = jest.spyOn(goToNext, 'goToNext')
      fireEvent.press(button)
      expect(spy).toHaveBeenCalled()
    }
  })
})
