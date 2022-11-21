import userEvent from '@testing-library/user-event'
import React, { createRef } from 'react'
import Swiper from 'react-native-web-swiper'

import { reset } from '__mocks__/@react-navigation/native'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { render } from 'tests/utils/web'

import { FourthCard } from './FourthCard'

describe('FourthCard', () => {
  it('should reset navigation on button press', async () => {
    const ref = createRef<Swiper>()
    const { getByText } = render(
      <FourthCard lastIndex={0} activeIndex={0} index={0} swiperRef={ref} />
    )

    await userEvent.click(getByText('Découvrir'))

    expect(reset).toHaveBeenNthCalledWith(1, { index: 0, routes: [{ name: homeNavConfig[0] }] })
  })
})
