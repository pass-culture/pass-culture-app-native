import { act, fireEvent, render } from '@testing-library/react-native'
import { rest } from 'msw'
import React, { RefObject } from 'react'
import Swiper from 'react-native-web-swiper'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { GetIdCheckTokenResponse, UserProfileResponse } from 'api/gen'
import { AuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'
import { MonitoringError } from 'libs/errorMonitoring'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { EighteenBirthdayCard } from './EighteenBirthdayCard'

const email = 'email@domain.ext'
const firstName = 'Jean'
const token = 'XYZT'
const mockShowSnackBar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSnackBar(props)),
  }),
}))

beforeEach(() => {
  simulateUserMeSuccess()
  simulateEligibleIdCheckToken()
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

  // TODO (PC-7003) : fix this test which fail randomly and only in CI
  it.skip('should go to id check when user is authed', async () => {
    const { getByText } = await renderEighteenBirthdayCard()

    fireEvent.press(getByText('Verifier mon identité'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('IdCheck', { email, licenceToken: token })
    })
  })

  it('should throw an error when opening id check when not eligible', async () => {
    simulateNotEligibleIdCheckToken()
    const { getByText } = await renderEighteenBirthdayCard()

    await waitForExpect(() => {
      expect(() => fireEvent.press(getByText('Verifier mon identité'))).toThrowError(
        new MonitoringError(
          'Nous ne pouvons pas vérifier ton identité pour le moment, reviens plus tard !',
          'NotEligibleIdCheckError'
        )
      )
    })
  })

  it('should go to login check when user is not authed', async () => {
    const { getByText } = await renderEighteenBirthdayCard({
      isLoggedIn: false,
    })

    fireEvent.press(getByText('Verifier mon identité'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('Login')
    })
    expect(mockShowSnackBar).toBeCalledWith({
      message: `Tu n'es pas connecté !`,
    })
  })
})

async function renderEighteenBirthdayCard({ isLoggedIn } = { isLoggedIn: true }) {
  const ref = { current: { goToNext: jest.fn() } }
  const renderAPI = render(
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

function simulateEligibleIdCheckToken() {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/id_check_token', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ token } as GetIdCheckTokenResponse))
    })
  )
}

function simulateNotEligibleIdCheckToken() {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/id_check_token', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ token: null } as GetIdCheckTokenResponse))
    })
  )
}
