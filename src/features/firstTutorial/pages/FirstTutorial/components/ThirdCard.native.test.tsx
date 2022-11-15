/* eslint-disable local-rules/independent-mocks */
import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'
import { mocked } from 'ts-jest/utils'

import { analytics } from 'libs/firebase/analytics'
import { GeolocationWrapper, GeolocPermissionState } from 'libs/geolocation'
import { requestGeolocPermission } from 'libs/geolocation/requestGeolocPermission'
import { fireEvent, render, waitFor } from 'tests/utils'
import { GenericAchievement } from 'ui/components/achievements'

import { ThirdCard } from './ThirdCard'

const mockRequestGeolocPermission = mocked(requestGeolocPermission)

describe('ThirdCard', () => {
  it('should render third card', () => {
    const firstTutorial = render(<ThirdCard index={0} activeIndex={0} lastIndex={0} />)
    expect(firstTutorial).toMatchSnapshot()
  })
  it('should not trigger analytics on refusal', async () => {
    mockRequestGeolocPermission.mockResolvedValue(GeolocPermissionState.DENIED)
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(
      <GeolocationWrapper>
        <GenericAchievement screenName="FirstTutorial">
          <ThirdCard
            swiperRef={ref as unknown as RefObject<Swiper>}
            index={0}
            activeIndex={0}
            lastIndex={0}
          />
        </GenericAchievement>
      </GeolocationWrapper>
    )
    fireEvent.press(getByText('Utiliser ma position'))
    await waitFor(() => {
      expect(analytics.logHasActivateGeolocFromTutorial).toBeCalledTimes(0)
    })
  })

  it('should trigger analytics on acceptance', async () => {
    mockRequestGeolocPermission.mockResolvedValue(GeolocPermissionState.GRANTED)
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(
      <GeolocationWrapper>
        <GenericAchievement screenName="FirstTutorial">
          <ThirdCard
            swiperRef={ref as unknown as RefObject<Swiper>}
            index={0}
            activeIndex={0}
            lastIndex={0}
          />
        </GenericAchievement>
      </GeolocationWrapper>
    )
    fireEvent.press(getByText('Utiliser ma position'))
    await waitFor(() => {
      expect(analytics.logHasActivateGeolocFromTutorial).toBeCalledTimes(1)
    })
  })

  it('should swipe to next card on button press', async () => {
    mockRequestGeolocPermission.mockResolvedValue(GeolocPermissionState.GRANTED)
    const ref = { current: { goToNext: jest.fn() } }
    const { getByText } = render(
      <GeolocationWrapper>
        <ThirdCard
          lastIndex={0}
          swiperRef={ref as unknown as RefObject<Swiper>}
          index={0}
          activeIndex={0}
        />
      </GeolocationWrapper>
    )
    fireEvent.press(getByText('Utiliser ma position'))
    await waitFor(() => {
      expect(ref.current?.goToNext).toHaveBeenCalledTimes(1)
    })
  })
})
