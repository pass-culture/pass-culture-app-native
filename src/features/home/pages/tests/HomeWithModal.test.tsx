import { NavigationContainer } from '@react-navigation/native'
import { render, act } from '@testing-library/react-native'
import React from 'react'

import { Tab } from 'features/navigation/TabBar/TabNavigator'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

import { Home } from '../Home'

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

jest.mock('features/home/pages/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

jest.mock('features/home/pages/useDisplayedHomeModules', () => ({
  useDisplayedHomeModules: jest.fn(() => ({
    displayedModules: [],
    algoliaModules: {},
  })),
}))

/**
 * We test the modal separately which require
 * the real navigation context to test useFocusEffect
 */
describe('Home component modal test', () => {
  it('should render modal correctly', async () => {
    const homeWithLoginModal = await homeRenderer(true)
    const homeWithoutLoginModal = await homeRenderer(false)

    expect(homeWithoutLoginModal).toMatchDiffSnapshot(homeWithLoginModal)
    homeWithLoginModal.unmount()
    homeWithoutLoginModal.unmount()
  })

  it('should render modal correctly', async () => {
    const { getByTestId, unmount } = await homeRenderer(true)

    expect(getByTestId('modal').props.visible).toBeTruthy()
    unmount()
  })

  it('should not render modal correctly', async () => {
    const { getByTestId, unmount } = await homeRenderer(false)

    expect(getByTestId('modal').props.visible).toBeFalsy()
    unmount()
  })
})

async function homeRenderer(withModal: boolean) {
  const renderAPI = render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen
            name="Home"
            component={Home}
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
