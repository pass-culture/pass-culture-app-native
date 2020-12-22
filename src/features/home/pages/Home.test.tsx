import { NavigationContainer } from '@react-navigation/native'
import { render, act } from '@testing-library/react-native'
import React from 'react'

import { useUserProfileInfo } from 'features/home/api'
import { Tab } from 'features/navigation/TabBar/TabNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

import { HomeComponent } from './Home'

const useUserProfileInfoMock = useUserProfileInfo as jest.Mock

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: undefined })),
}))

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('libs/environment', () => ({
  env: {
    FEATURE_FLAG_CODE_PUSH: true,
    CHEAT_BUTTONS_ENABLED: false,
  },
}))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: false })),
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
    const home = await homeRenderer(false)

    expect(home).toMatchSnapshot()
    home.unmount()
  })

  it('should render modal correctly', async () => {
    const homeWithLoginModal = await homeRenderer(true)
    const homeWithoutLoginModal = await homeRenderer(false)

    expect(homeWithoutLoginModal).toMatchDiffSnapshot(homeWithLoginModal)
    homeWithLoginModal.unmount()
    homeWithoutLoginModal.unmount()
  })

  it('should have a welcome message', async () => {
    const { getByText, unmount } = await homeRenderer(false)

    const welcomeText = getByText('Bienvenue !')
    expect(welcomeText.props.children).toBe('Bienvenue !')
    unmount()
  })

  it('should have a personalized welcome message when user is logged in', async () => {
    useUserProfileInfoMock.mockImplementationOnce(() => ({
      data: { email: 'email@domain.ext', firstName: 'Jean' },
    }))

    const { getByText, unmount } = await homeRenderer(false)

    const welcomeText = getByText('Bonjour Jean')
    expect(welcomeText.props.children).toBe('Bonjour Jean')
    unmount()
  })
  it('should not have code push button', async () => {
    env.FEATURE_FLAG_CODE_PUSH_MANUAL = false
    const home = await homeRenderer(false)

    expect(() => home.getByText('Check update')).toThrowError()
    home.unmount()
  })

  it('should have components and navigation buttons when CHEAT_BUTTONS_ENABLED', async () => {
    env.CHEAT_BUTTONS_ENABLED = true
    const home = await homeRenderer(false)

    expect(() => home.getByText('Composants')).toBeTruthy()
    expect(() => home.getByText('Navigation')).toBeTruthy()
    home.unmount()
  })

  it('should NOT have components or navigation buttons when NOT CHEAT_BUTTONS_ENABLED', async () => {
    env.CHEAT_BUTTONS_ENABLED = false
    const home = await homeRenderer(false)

    expect(() => home.getByText('Composants')).toThrowError()
    expect(() => home.getByText('Navigation')).toThrowError()
    home.unmount()
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
    const home = await homeRenderer(false)
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
    const home = await homeRenderer(false)
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

async function homeRenderer(withModal: boolean) {
  const renderAPI = render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen
            name="Home"
            component={HomeComponent}
            initialParams={{ shouldDisplayLoginModal: withModal }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    )
  )
  await act(async () => {
    await flushAllPromises()
  })
  return renderAPI
}
