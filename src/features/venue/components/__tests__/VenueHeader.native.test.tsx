import { rest } from 'msw'
import React from 'react'
import { Animated } from 'react-native'

import { goBack } from '__mocks__/@react-navigation/native'
import { VenueResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct, cleanup, fireEvent, render } from 'tests/utils'

import { VenueHeader } from '../VenueHeader'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('<VenueHeader />', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await cleanup()
  })

  it('should render correctly', async () => {
    const { toJSON } = await renderVenueHeader({ isLoggedIn: true })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render back icon - loggedIn', async () => {
    const venueHeader = await renderVenueHeader({ isLoggedIn: true })
    expect(venueHeader.queryByTestId('icon-back')).toBeTruthy()
  })

  it('should render back icon - not loggedIn', async () => {
    const venueHeader = await renderVenueHeader({ isLoggedIn: false })
    expect(venueHeader.queryByTestId('icon-back')).toBeTruthy()
  })

  it('should goBack when we press on the back button', async () => {
    const { getByTestId } = await renderVenueHeader({ isLoggedIn: true })
    fireEvent.press(getByTestId('icon-back'))
    expect(goBack).toBeCalledTimes(1)
  })
})

const venueId = 5543

interface Options {
  id?: number
  isLoggedIn?: boolean
}

const defaultOptions = {
  id: venueId,
  isLoggedIn: true,
}

async function renderVenueHeader(options: Options = defaultOptions) {
  const { id, isLoggedIn } = {
    ...defaultOptions,
    ...options,
  }

  server.use(
    rest.get<VenueResponse>(`${env.API_BASE_URL}/native/v1/venue/${id}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(venueResponseSnap))
    )
  )
  mockUseAuthContext.mockImplementation(() => ({ isLoggedIn, setIsLoggedIn: jest.fn() }))

  const animatedValue = new Animated.Value(0)
  const wrapper = render(reactQueryProviderHOC(<VenueHeader headerTransition={animatedValue} />))
  await superFlushWithAct(20)
  return { ...wrapper, animatedValue }
}
