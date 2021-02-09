import { act, fireEvent, render } from '@testing-library/react-native'
import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'

import { SecondCard } from './SecondCard'

describe('SecondCard', () => {
  it('should render second card', () => {
    const firstTutorial = render(<SecondCard />)
    expect(firstTutorial).toMatchSnapshot()
  })
  it('should swipe to next card on button press', async () => {
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(<SecondCard swiperRef={(ref as unknown) as RefObject<Swiper>} />)
    const button = await getByText('Continuer')
    fireEvent.press(button)
    await act(async () => {
      expect(ref.current.goToNext).toHaveBeenCalled()
    })
  })
})
