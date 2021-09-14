import { rest } from 'msw'
import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { AuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, superFlushWithAct } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { EighteenBirthdayCard } from './EighteenBirthdayCard'

const email = 'email@domain.ext'
const firstName = 'Jean'
const mockShowInfoSnackBar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

beforeEach(() => {
  simulateUserMeSuccess()
})

afterEach(jest.clearAllMocks)

describe('<EighteenBirthdayCard />', () => {
  it('should render eighteen birthday card', async () => {
    jest.useFakeTimers()
    const firstTutorial = await renderEighteenBirthdayCard()

    act(() => {
      jest.advanceTimersByTime(2000)
    })
    await superFlushWithAct()

    expect(firstTutorial).toMatchSnapshot()
    jest.useRealTimers()
  })

  it('should go to id check when user is authed', async () => {
    const { getByText } = await renderEighteenBirthdayCard()

    fireEvent.press(getByText('Vérifier mon identité'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdCheck', {
        email,
        expiration_timestamp: undefined,
        licence_token: undefined,
      })
    })
  })

  it('should go to login check when user is not authed', async () => {
    const { getByText } = await renderEighteenBirthdayCard({
      isLoggedIn: false,
    })

    fireEvent.press(getByText('Vérifier mon identité'))
    await superFlushWithAct()

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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn: jest.fn() }}>
        <EighteenBirthdayCard
          activeIndex={0}
          index={0}
          lastIndex={0}
          swiperRef={(ref as unknown) as RefObject<Swiper>}
        />
      </AuthContext.Provider>
    )
  )
  await superFlushWithAct()
  return renderAPI
}

function simulateUserMeSuccess() {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ email, firstName } as UserProfileResponse))
    })
  )
}
