import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'

import { AuthContext } from 'features/auth/context/AuthContext'
import { useBeneficiaryValidationNavigation } from 'features/auth/helpers/useBeneficiaryValidationNavigation'
import { fireEvent, render, screen } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { EighteenBirthdayCard } from './EighteenBirthdayCard'

const mockShowInfoSnackBar = jest.fn()

jest.mock('react-query')
jest.mock('features/auth/helpers/useBeneficiaryValidationNavigation')
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

/* TODO(LucasBeneston): Remove this mock when update to Jest 28
  In jest version 28, I don't bring that error :
  TypeError: requestAnimationFrame is not a function */
jest.mock('react-native/Libraries/Animated/animations/TimingAnimation')

describe('<EighteenBirthdayCard />', () => {
  it('should render eighteen birthday card', () => {
    const firstTutorial = renderEighteenBirthdayCard()

    expect(firstTutorial).toMatchSnapshot()
  })

  it('should navigate to nextBeneficiaryValidationStep on press "Vérifier mon identité"', () => {
    const setError = jest.fn()
    const {
      navigateToNextBeneficiaryValidationStep: mockedNavigateToNextBeneficiaryValidationStep,
    } = useBeneficiaryValidationNavigation(setError)

    renderEighteenBirthdayCard()

    fireEvent.press(screen.getByText('Vérifier mon identité'))

    expect(mockedNavigateToNextBeneficiaryValidationStep).toHaveBeenCalledTimes(1)
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
