import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { FavoriteResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render } from 'tests/utils/web'

import { BicolorFavoriteCount } from '../BicolorFavoriteCount'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('BicolorFavoriteCount component', () => {
  it('should render non connected icon', async () => {
    const { queryByTestId } = await renderBicolorFavoriteCount({ isLoggedIn: false })
    expect(queryByTestId('bicolor-favorite-count')).toBeFalsy()
  })

  it('should render connected icon', async () => {
    const { getByTestId } = await renderBicolorFavoriteCount({ isLoggedIn: true })
    await waitForExpect(() => {
      expect(getByTestId('bicolor-favorite-count')).toBeTruthy()
    })
  })

  it('should show 99+ badge when nbFavorites is greater than or equal to 100', async () => {
    const { getByText } = await renderBicolorFavoriteCount({ isLoggedIn: true, count: 10000 })
    await waitForExpect(() => {
      expect(getByText('99')).toBeTruthy()
    })
  })

  it('should show nbFavorites within badge', async () => {
    const { getByText } = await renderBicolorFavoriteCount({ isLoggedIn: true })
    await waitForExpect(() => {
      expect(getByText(defaultOptions.count.toString())).toBeTruthy()
    })
  })

  it('should show 0 within badge when no favorite', async () => {
    const { getByText } = await renderBicolorFavoriteCount({ isLoggedIn: true, count: 0 })
    await waitForExpect(() => {
      expect(getByText('0')).toBeTruthy()
    })
  })
})

interface Options {
  isLoggedIn?: boolean
  count?: number
}

const defaultOptions = {
  isLoggedIn: false,
  count: 4,
}

async function renderBicolorFavoriteCount(options: Options = defaultOptions) {
  const { isLoggedIn, count } = { ...defaultOptions, ...options }
  server.use(
    rest.get<Array<FavoriteResponse>>(
      `${env.API_BASE_URL}/native/v1/me/favorites/count`,
      (req, res, ctx) => res(ctx.status(200), ctx.json({ count }))
    )
  )
  mockUseAuthContext.mockReturnValue({ isLoggedIn, setIsLoggedIn: jest.fn() })
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<BicolorFavoriteCount />))
}
