import { fireEvent, render } from '@testing-library/react-native'
import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'

import { navigate } from '__mocks__/@react-navigation/native'
import { NavigateToHomeWithoutModalOptions } from 'features/navigation/helpers'

import { EighteenBirthdayCard } from './EighteenBirthdayCard'

describe('EighteenBirthdayCard', () => {
  it('should render eighteen birthday card', () => {
    const firstTutorial = render(<EighteenBirthdayCard activeIndex={0} index={0} />)
    expect(firstTutorial).toMatchSnapshot()
  })

  it('should swipe to next card on button press', () => {
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(
      <EighteenBirthdayCard
        activeIndex={0}
        index={0}
        swiperRef={(ref as unknown) as RefObject<Swiper>}
      />
    )

    fireEvent.press(getByText('Verifier mon identité'))
    expect(navigate).toBeCalledWith('Home', NavigateToHomeWithoutModalOptions)
  })
})
