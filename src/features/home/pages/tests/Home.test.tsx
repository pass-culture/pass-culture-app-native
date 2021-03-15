import { render, act, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { useRoute } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { AuthContext } from 'features/auth/AuthContext'
import { ProcessedModule } from 'features/home/contentful'
import { RecommendationPane } from 'features/home/contentful/moduleTypes'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises, flushAllPromisesTimes } from 'tests/utils'

import { Home } from '../Home'

allowConsole({ error: true })

jest.mock('libs/environment', () => ({
  env: {
    FEATURE_FLAG_CODE_PUSH: true,
    CHEAT_BUTTONS_ENABLED: false,
  },
}))

jest.mock('features/home/pages/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

let mockDisplayedModules: ProcessedModule[] = []
jest.mock('features/home/pages/useDisplayedHomeModules', () => ({
  useDisplayedHomeModules: jest.fn(() => ({
    displayedModules: mockDisplayedModules,
    algoliaModules: {},
    recommendedHits: mockedAlgoliaResponse.hits.slice(0, 4),
  })),
}))

function simulateAuthenticatedUser(partialUser?: Partial<UserProfileResponse>) {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          email: 'email@domain.ext',
          firstName: 'Jean',
          depositExpirationDate: '2023-02-16T17:16:04.735235',
          expenses: [
            { current: 400, domain: 'all', limit: 50000 },
            { current: 400, domain: 'digital', limit: 20000 },
            { current: 0, domain: 'physical', limit: 20000 },
          ],
          ...(partialUser || {}),
        } as UserProfileResponse)
      )
    })
  )
}

describe('Home component', () => {
  it('should render correctly without login modal', async () => {
    const home = await homeRenderer({ isLoggedIn: false, withModal: false })
    expect(home).toMatchSnapshot()
  })

  it('should render modal correctly', async () => {
    const { getByText } = await homeRenderer({ isLoggedIn: false, withModal: true })
    expect(getByText('Se connecter')).toBeTruthy()
  })

  it('should have a welcome message', async () => {
    const { getByText } = await homeRenderer({ isLoggedIn: false, withModal: false })
    const welcomeText = getByText('Bienvenue !')
    expect(welcomeText.props.children).toBe('Bienvenue !')
  })

  it('should have a personalized welcome message when user is logged in', async () => {
    const { getByText } = await homeRenderer({ isLoggedIn: true, withModal: false })
    await waitForExpect(() => {
      const welcomeText = getByText('Bonjour Jean')
      expect(welcomeText.props.children).toBe('Bonjour Jean')
    })
  })

  it('should show the available credit to the user - remaining', async () => {
    const { queryByText } = await homeRenderer({ isLoggedIn: true, withModal: false })
    await waitForExpect(() => {
      expect(queryByText('Tu as 496 € sur ton pass')).toBeTruthy()
    })
  })

  it('should show the available credit to the user - expired', async () => {
    const { queryByText } = await homeRenderer({
      isLoggedIn: true,
      withModal: false,
      partialUser: { depositExpirationDate: new Date('2020-02-16T17:16:04.735235') },
    })
    await waitForExpect(() => {
      expect(queryByText('Tu as 496 € sur ton pass')).toBeFalsy()
      expect(queryByText('Ton crédit est expiré')).toBeTruthy()
    })
  })

  it('should show the available credit to the user - not logged in', async () => {
    const { queryByText } = await homeRenderer({ isLoggedIn: false, withModal: false })
    expect(queryByText('Toute la culture dans ta main')).toBeTruthy()
  })

  it('should not have code push button', async () => {
    const home = await homeRenderer({ withModal: false })
    expect(home.queryByText('Check update')).toBeFalsy()
  })

  it('should have components and navigation buttons when CHEAT_BUTTONS_ENABLED', async () => {
    env.CHEAT_BUTTONS_ENABLED = true
    const home = await homeRenderer({ isLoggedIn: false, withModal: false })
    expect(home.queryByText('Composants')).toBeTruthy()
    expect(home.queryByText('Navigation')).toBeTruthy()
  })

  it('should NOT have components or navigation buttons when NOT CHEAT_BUTTONS_ENABLED', async () => {
    env.CHEAT_BUTTONS_ENABLED = false
    const home = await homeRenderer({ isLoggedIn: false, withModal: false })
    expect(home.queryByText('Composants')).toBeFalsy()
    expect(home.queryByText('Navigation')).toBeFalsy()
  })
})

describe('Home component - Analytics', () => {
  const nativeEventMiddle = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 400 }, // how far did we scroll
    contentSize: { height: 1600 },
  }
  const nativeEventBottom = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 900 },
    contentSize: { height: 1600 },
  }

  it('should trigger logEvent "AllModulesSeen" when reaching the end', async () => {
    const home = await homeRenderer({ isLoggedIn: false, withModal: false })
    const scrollView = home.getByTestId('homeScrollView')
    await act(async () => {
      await flushAllPromises()
    })

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    })
    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    })

    expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(0)
  })

  it('should trigger logEvent "AllModulesSeen" only once', async () => {
    const home = await homeRenderer({ isLoggedIn: false, withModal: false })
    const scrollView = home.getByTestId('homeScrollView')

    await act(async () => {
      await flushAllPromises()
    })

    await act(async () => {
      // 1st scroll to bottom => trigger
      await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
      await flushAllPromises()
    })
    expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(0)

    // @ts-ignore: logAllModulesSeen is the mock function but is seen as the real function
    analytics.logAllModulesSeen.mockClear()

    await act(async () => {
      // 2nd scroll to bottom => NOT trigger
      await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
      await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
      await flushAllPromises()
    })

    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
  })

  it('should trigger logEvent "RecommendationModuleSeen" when reaching the recommendation module', async () => {
    mockDisplayedModules = [
      new RecommendationPane({
        display: { title: 'Tes offres recommandées', minOffers: 2, layout: 'one-item-medium' },
      }),
    ]
    const home = await homeRenderer({ isLoggedIn: false, withModal: false })
    const scrollView = home.getByTestId('homeScrollView')
    await act(flushAllPromises)

    await waitFor(async () => {
      await home
        .getByTestId('recommendationModuleTracker')
        .props.onLayout({ nativeEvent: { layout: { y: 1500 } } })
      expect(home.getByTestId('recommendationModuleTracker')).toBeTruthy()
    })

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    })
    expect(analytics.logRecommendationModuleSeen).not.toHaveBeenCalled()

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    })

    expect(analytics.logRecommendationModuleSeen).toHaveBeenCalledWith('Tes offres recommandées', 4)
  })
})

interface Props {
  isLoggedIn?: boolean | undefined
  withModal?: boolean | undefined
  partialUser?: Partial<UserProfileResponse>
}

async function homeRenderer(
  { isLoggedIn, withModal, partialUser }: Props = {
    isLoggedIn: false,
    withModal: false,
    partialUser: {},
  }
) {
  useRoute.mockReturnValue({
    params: {
      shouldDisplayLoginModal: withModal,
    },
  })
  if (isLoggedIn) simulateAuthenticatedUser(partialUser)
  const renderAPI = render(
    reactQueryProviderHOC(
      <AuthContext.Provider value={{ isLoggedIn: !!isLoggedIn, setIsLoggedIn: jest.fn() }}>
        <Home />
      </AuthContext.Provider>
    )
  )
  await act(async () => await flushAllPromisesTimes(10))
  return renderAPI
}
