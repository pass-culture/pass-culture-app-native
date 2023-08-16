import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'

import { navigate } from '__mocks__/@react-navigation/native'
import { AuthContext } from 'features/auth/context/AuthContext'
import { fireEvent, render, screen } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { EighteenBirthdayCard } from './EighteenBirthdayCard'

const mockShowInfoSnackBar = jest.fn()

jest.mock('react-query')
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

describe('<EighteenBirthdayCard />', () => {
  it('should render eighteen birthday card', () => {
    const firstTutorial = renderEighteenBirthdayCard()

    expect(firstTutorial).toMatchSnapshot()
  })

  it('should navigate to Stepper on press "Vérifier mon identité"', () => {
    renderEighteenBirthdayCard()

    fireEvent.press(screen.getByText('Confirmer mes informations'))

    expect(navigate).toHaveBeenCalledWith('Stepper')
  })
})

function renderEighteenBirthdayCard({ isLoggedIn } = { isLoggedIn: true }) {
  const ref = { current: { goToNext: jest.fn() } }
  const renderAPI = render(
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
      }}>
      <EighteenBirthdayCard
        activeIndex={0}
        index={0}
        lastIndex={0}
        swiperRef={ref as unknown as RefObject<Swiper>}
      />
    </AuthContext.Provider>
  )
  return renderAPI
}
