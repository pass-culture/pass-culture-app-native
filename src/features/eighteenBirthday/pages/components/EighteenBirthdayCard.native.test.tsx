import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'
import waitForExpect from 'wait-for-expect'

import { AuthContext } from 'features/auth/AuthContext'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { useUserProfileInfo } from 'features/home/api'
import { nonBeneficiaryUser } from 'fixtures/user'
import { act, fireEvent, render } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { EighteenBirthdayCard } from './EighteenBirthdayCard'

const mockShowInfoSnackBar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

jest.mock('features/auth/signup/useBeneficiaryValidationNavigation')

jest.mock('react-query')
jest.mock('features/home/api')
const mockedUseUserProfileInfo = useUserProfileInfo as jest.Mock

describe('<EighteenBirthdayCard />', () => {
  it('should render eighteen birthday card', async () => {
    jest.useFakeTimers()
    const firstTutorial = await renderEighteenBirthdayCard()

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(firstTutorial).toMatchSnapshot()
    jest.useRealTimers()
  })

  it('should navigate to nextBeneficiaryValidationStep on press "Vérifier mon identité"', async () => {
    const setError = jest.fn()
    mockedUseUserProfileInfo.mockReturnValueOnce({ data: nonBeneficiaryUser })
    const {
      navigateToNextBeneficiaryValidationStep: mockedNavigateToNextBeneficiaryValidationStep,
    } = useBeneficiaryValidationNavigation(setError)

    const { getByText } = await renderEighteenBirthdayCard()

    fireEvent.press(getByText('Vérifier mon identité'))

    await waitForExpect(() => {
      expect(mockedNavigateToNextBeneficiaryValidationStep).toBeCalled()
    })
  })
})

async function renderEighteenBirthdayCard({ isLoggedIn } = { isLoggedIn: true }) {
  const ref = { current: { goToNext: jest.fn() } }
  const renderAPI = render(
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn: jest.fn() }}>
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
