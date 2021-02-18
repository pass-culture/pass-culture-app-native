import { render, act } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { AuthContext } from 'features/auth/AuthContext'
import { simulateMustShowEligibleCard } from 'features/eighteenBirthday/useEligibleCard.test'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises, flushAllPromisesTimes } from 'tests/utils'

import { Home } from './Home'

jest.mock('libs/environment', () => ({
  env: {
    FEATURE_FLAG_CODE_PUSH: true,
    CHEAT_BUTTONS_ENABLED: false,
  },
}))

jest.mock('./useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

jest.mock('features/home/pages/useDisplayedHomeModules', () => ({
  useDisplayedHomeModules: jest.fn(() => ({
    displayedModules: [],
    algoliaModules: {},
  })),
}))

describe('Home component', () => {
  it('should render correctly without login modal', async () => {
    const home = await homeRenderer({ isLoggedIn: false, withModal: false })

    expect(home).toMatchSnapshot()
    home.unmount()
  })

  it('should render modal correctly', async () => {
    const { getByText, unmount } = await homeRenderer({ isLoggedIn: false, withModal: true })
    expect(getByText('Se connecter')).toBeTruthy()
    unmount()
  })

  it('should have a welcome message', async () => {
    const { getByText, unmount } = await homeRenderer({ isLoggedIn: false, withModal: false })

    const welcomeText = getByText('Bienvenue !')
    expect(welcomeText.props.children).toBe('Bienvenue !')
    unmount()
  })

  it('should have a personalized welcome message when user is logged in', async () => {
    simulateAuthedUser()
    const { getByText, unmount } = await homeRenderer({ isLoggedIn: true, withModal: false })
    await waitForExpect(() => {
      const welcomeText = getByText('Bonjour Jean')
      expect(welcomeText.props.children).toBe('Bonjour Jean')
    })
    unmount()
  })

  it('should not have code push button', async () => {
    const home = await homeRenderer({ withModal: false })

    expect(home.queryByText('Check update')).toBeFalsy()
    home.unmount()
  })

  it('should have components and navigation buttons when CHEAT_BUTTONS_ENABLED', async () => {
    env.CHEAT_BUTTONS_ENABLED = true
    const home = await homeRenderer({ isLoggedIn: false, withModal: false })

    expect(home.queryByText('Composants')).toBeTruthy()
    expect(home.queryByText('Navigation')).toBeTruthy()
    home.unmount()
  })

  it('should NOT have components or navigation buttons when NOT CHEAT_BUTTONS_ENABLED', async () => {
    env.CHEAT_BUTTONS_ENABLED = false
    const home = await homeRenderer({ isLoggedIn: false, withModal: false })

    expect(home.queryByText('Composants')).toBeFalsy()
    expect(home.queryByText('Navigation')).toBeFalsy()
    home.unmount()
  })
  function simulateAuthedUser() {
    server.use(
      rest.get(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ email: 'email@domain.ext', firstName: 'Jean' } as UserProfileResponse)
        )
      })
    )
  }
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
})

describe('Home redirection to EighteenBirthday', () => {
  beforeEach(async () => {
    await storage.clear('has_seen_eligible_card')
  })

  it('should trigger redirection when eligible', async () => {
    simulateMustShowEligibleCard()
    await storage.saveObject('has_seen_eligible_card', false)
    await homeRenderer({ isLoggedIn: true, withModal: false })

    await act(async () => await flushAllPromisesTimes(10))

    expect(navigate).toBeCalledWith('EighteenBirthday')
  })

  it('should not trigger redirection when not eligible', async () => {
    await storage.saveObject('has_seen_eligible_card', true)
    await homeRenderer({ isLoggedIn: true, withModal: false })

    await act(async () => await flushAllPromisesTimes(10))

    expect(navigate).not.toBeCalledWith('EighteenBirthday')
  })
})

interface Props {
  isLoggedIn?: boolean | undefined
  withModal?: boolean | undefined
}

async function homeRenderer(
  { isLoggedIn, withModal }: Props = { isLoggedIn: false, withModal: false }
) {
  useRoute.mockReturnValue({
    params: {
      shouldDisplayLoginModal: withModal,
    },
  })
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
