import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'

import { act, fireEvent, render } from 'tests/utils'

import { FirstCard } from './FirstCard'

describe('FirstCard', () => {
  it('should render first card', () => {
    const firstTutorial = render(<FirstCard activeIndex={0} index={0} lastIndex={0} />)
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should swipe to next card on button press', async () => {
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(
      <FirstCard
        lastIndex={0}
        activeIndex={0}
        index={0}
        swiperRef={ref as unknown as RefObject<Swiper>}
      />
    )

    fireEvent.press(getByText('Continuer'))

    await act(async () => {
      expect(ref.current.goToNext).toHaveBeenCalledTimes(1)
    })
  })
})
