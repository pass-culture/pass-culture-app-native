import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React, { RefObject } from 'react'
import Geolocation from 'react-native-geolocation-service'
import Swiper from 'react-native-web-swiper'

import { analytics } from 'libs/analytics'
import { GeolocationWrapper } from 'libs/geolocation'

import { ThirdCard } from './ThirdCard'

describe('ThirdCard', () => {
  it('should render third card', () => {
    const firstTutorial = render(<ThirdCard />)
    expect(firstTutorial).toMatchSnapshot()
  })
  it('should not trigger analytics on refusal', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('denied')
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(
      <GeolocationWrapper>
        <ThirdCard swiperRef={(ref as unknown) as RefObject<Swiper>} />
      </GeolocationWrapper>
    )
    fireEvent.press(getByText('Activer la géolocalisation'))
    await waitFor(() => {
      expect(analytics.logHasActivateGeolocFromTutorial).toHaveBeenCalledTimes(0)
    })
  })

  it('should trigger analytics on acceptance', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('granted')
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(
      <GeolocationWrapper>
        <ThirdCard swiperRef={(ref as unknown) as RefObject<Swiper>} />
      </GeolocationWrapper>
    )
    fireEvent.press(getByText('Activer la géolocalisation'))
    await waitFor(() => {
      expect(analytics.logHasActivateGeolocFromTutorial).toHaveBeenCalledTimes(1)
    })
  })

  it('should swipe to next card on button press', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('granted')
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(
      <GeolocationWrapper>
        <ThirdCard swiperRef={(ref as unknown) as RefObject<Swiper>} />
      </GeolocationWrapper>
    )
    fireEvent.press(getByText('Activer la géolocalisation'))
    await waitFor(() => {
      expect(ref.current?.goToNext).toBeCalled()
    })
  })
})
