import React, { RefObject } from 'react'
import Geolocation from 'react-native-geolocation-service'
import Swiper from 'react-native-web-swiper'

import { analytics } from 'libs/analytics'
import { GeolocationWrapper } from 'libs/geolocation'
import { fireEvent, render, waitFor } from 'tests/utils'
import { GenericAchievement } from 'ui/components/achievements'

import { ThirdCard } from './ThirdCard'

describe('ThirdCard', () => {
  it('should render third card', () => {
    const firstTutorial = render(<ThirdCard index={0} activeIndex={0} lastIndex={0} />)
    expect(firstTutorial).toMatchSnapshot()
  })
  it('should not trigger analytics on refusal', async () => {
    jest.spyOn(Geolocation, 'requestAuthorization').mockResolvedValueOnce('denied')
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(
      <GeolocationWrapper>
        <GenericAchievement name="TestAchievement">
          <ThirdCard
            swiperRef={(ref as unknown) as RefObject<Swiper>}
            index={0}
            activeIndex={0}
            lastIndex={0}
          />
        </GenericAchievement>
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
        <GenericAchievement name="TestAchievement">
          <ThirdCard
            swiperRef={(ref as unknown) as RefObject<Swiper>}
            index={0}
            activeIndex={0}
            lastIndex={0}
          />
        </GenericAchievement>
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
        <ThirdCard
          lastIndex={0}
          swiperRef={(ref as unknown) as RefObject<Swiper>}
          index={0}
          activeIndex={0}
        />
      </GeolocationWrapper>
    )
    fireEvent.press(getByText('Activer la géolocalisation'))
    await waitFor(() => {
      expect(ref.current?.goToNext).toBeCalled()
    })
  })
})
