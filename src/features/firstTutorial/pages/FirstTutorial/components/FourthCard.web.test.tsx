import userEvent from '@testing-library/user-event'
import React, { createRef } from 'react'
import Swiper from 'react-native-web-swiper'

import { reset } from '__mocks__/@react-navigation/native'
import { render, screen } from 'tests/utils/web'

import { FourthCard } from './FourthCard'

describe('FourthCard', () => {
  it('should reset navigation to profil on button press', async () => {
    const ref = createRef<Swiper>()
    render(<FourthCard lastIndex={0} activeIndex={0} index={0} swiperRef={ref} />)

    await userEvent.click(screen.getByText('J’ai compris'))

    expect(reset).toHaveBeenNthCalledWith(1, {
      index: 0,
      routes: [{ name: 'TabNavigator', state: { routes: [{ name: 'Profile' }] } }],
    })
  })
})
