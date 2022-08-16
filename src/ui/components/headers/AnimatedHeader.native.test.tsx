import React from 'react'
import { Animated } from 'react-native'

import { useAuthContext } from 'features/auth/AuthContext'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { useShareOffer } from 'features/offer/services/useShareOffer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'
import { AnimatedHeader } from 'ui/components/headers/AnimatedHeader'

const mockedUseAuthContext = useAuthContext as jest.Mock
jest.mock('features/auth/AuthContext', () => ({ useAuthContext: jest.fn() }))

describe('<AnimatedHeader />', () => {
  describe('icons', () => {
    it('should display back icon ', async () => {
      const header = await renderAnimatedHeader({ isLoggedIn: false })
      expect(header.queryByTestId('icon-back')).toBeTruthy()
    })

    it('should display back icon ', async () => {
      const header = await renderAnimatedHeader({ isLoggedIn: false })
      expect(header.queryByTestId('icon-share')).toBeTruthy()
    })

    it('should display favorite icon', async () => {
      const header = await renderAnimatedHeader({ isLoggedIn: false })
      expect(header.queryByTestId('icon-favorite')).toBeTruthy()
    })
  })
})

async function renderAnimatedHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  mockedUseAuthContext.mockReturnValue({ isLoggedIn })
  const animatedValue = new Animated.Value(0)
  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <AnimatedHeader
        headerTransition={animatedValue}
        title={offerResponseSnap.name}
        id={offerResponseSnap.id}
        shareButton={{
          onSharePress: useShareOffer,
          shareContentTitle: 'Partager le lieu',
        }}
        favoriteButton={{
          onFavoritePress: jest.fn(),
        }}
      />
    )
  )
  return { ...wrapper, animatedValue }
}
