import AsyncStorage from '@react-native-community/async-storage'
import { act, fireEvent, render } from '@testing-library/react-native'
import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'

import { FirstCard } from './FirstCard'

describe('FirstCard', () => {
  it('should render first card', () => {
    const firstTutorial = render(<FirstCard />)
    expect(firstTutorial).toMatchSnapshot()
  })
  it('should swipe to next card on button press', async () => {
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(<FirstCard swiperRef={(ref as unknown) as RefObject<Swiper>} />)
    const button = await getByText('Continuer')
    fireEvent.press(button)
    expect(AsyncStorage.setItem).toBeCalledWith('has_seen_tutorials', 'true')
    await act(async () => {
      expect(ref.current.goToNext).toHaveBeenCalled()
    })
  })
})
