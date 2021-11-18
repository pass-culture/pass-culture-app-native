import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { AuthContext } from 'features/auth/AuthContext'
import { useNavigateToIdCheck } from 'features/auth/signup/idCheck/useNavigateToIdCheck'
import { useUserProfileInfo } from 'features/home/api'
import { act, fireEvent, render } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { EighteenBirthdayCard } from './EighteenBirthdayCard'

const mockShowInfoSnackBar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

jest.mock('react-query')
jest.mock('features/auth/signup/idCheck/useNavigateToIdCheck')
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

  it('should go to id check when user is authed', async () => {
    const mockedNavigateToIdCheck = useNavigateToIdCheck()

    const { getByText } = await renderEighteenBirthdayCard()

    fireEvent.press(getByText('Vérifier mon identité'))

    await waitForExpect(() => {
      expect(mockedNavigateToIdCheck).toBeCalledWith()
    })
  })

  it('should go to login check when user is not authed', async () => {
    mockedUseUserProfileInfo.mockReturnValueOnce({ data: undefined })
    const { getByText } = await renderEighteenBirthdayCard({
      isLoggedIn: false,
    })

    fireEvent.press(getByText('Vérifier mon identité'))

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('Login')
    })
    expect(mockShowInfoSnackBar).toBeCalledWith({
      message: `Tu n'es pas connecté !`,
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
        swiperRef={(ref as unknown) as RefObject<Swiper>}
      />
    </AuthContext.Provider>
  )
  return renderAPI
}
