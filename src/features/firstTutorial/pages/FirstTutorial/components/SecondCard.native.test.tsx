import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'

import { fireEvent, render } from 'tests/utils'

import { SecondCard } from './SecondCard'

jest.mock('features/auth/api')

const mockSettings = {
  enableUnderageGeneralisation: false,
  enableNativeEacIndividual: false,
}
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

describe('SecondCard', () => {
  it('should render second card', () => {
    const firstTutorial = render(<SecondCard activeIndex={0} index={0} lastIndex={0} />)
    expect(firstTutorial).toMatchSnapshot()
  })

  it.each([
    [true, 'de 15 à 18 ans\u00a0: le Gouvernement offre un crédit à dépenser dans l’application.'],
    [
      false,
      "dans l'année de tes 18 ans, le Gouvernement offre un crédit de 300€ à dépenser dans l’application.",
    ],
  ])(
    'should display correct description if enableNativeEacIndividual and enableUnderageGeneralisation are %s',
    (isSettingEnabled, description) => {
      mockSettings.enableNativeEacIndividual = isSettingEnabled
      mockSettings.enableUnderageGeneralisation = isSettingEnabled
      const { getByText } = render(<SecondCard activeIndex={0} index={0} lastIndex={0} />)

      expect(getByText(description)).toBeTruthy()
    }
  )

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
