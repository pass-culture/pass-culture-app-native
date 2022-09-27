import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'

import { fireEvent, render } from 'tests/utils'

import { SecondCard } from './SecondCard'

jest.mock('features/auth/api')

describe('SecondCard', () => {
  it('should render second card', () => {
    const firstTutorial = render(<SecondCard activeIndex={0} index={0} lastIndex={0} />)
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should display correct description', () => {
    const { getByText } = render(<SecondCard activeIndex={0} index={0} lastIndex={0} />)

    expect(
      getByText('de 15 à 18 ans\u00a0: l’État offre un crédit à dépenser dans l’application.')
    ).toBeTruthy()
  })

  it('should swipe to next card on button press', () => {
    const ref = {
      current: {
        goToNext: jest.fn(),
      },
    }
    const { getByText } = render(
      <SecondCard
        lastIndex={0}
        swiperRef={ref as unknown as RefObject<Swiper>}
        activeIndex={0}
        index={0}
      />
    )
    fireEvent.press(getByText('Continuer'))
    expect(ref.current.goToNext).toHaveBeenCalled()
  })
})
