import React, { ComponentProps } from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import * as showSkeletonAPI from 'features/home/api/useShowSkeleton'
import {
  formattedVenuesModule,
  formattedVideoCarouselModuleWithMultipleItems,
  highlightHeaderFixture,
} from 'features/home/fixtures/homepage.fixture'
import { GenericHome } from 'features/home/pages/GenericHome'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { BatchProfile } from 'libs/react-native-batch'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
// Removed: old tracking system import
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, waitFor, within } from 'tests/utils'
import { Typo } from 'ui/theme'
const useShowSkeletonSpy = jest.spyOn(showSkeletonAPI, 'useShowSkeleton').mockReturnValue(false)

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

useRoute.mockReturnValue({ name: 'Home' })

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const defaultModules = [formattedVenuesModule]
const homeId = 'fake-id'
const Header = <Typo.Title1>Header</Typo.Title1>

jest.mock('libs/firebase/analytics/analytics')
jest.mock('shared/analytics/logViewItem')
jest.mock('shared/tracking/usePageTracking', () => ({
  usePageTracking: () => ({
    trackViewableItems: jest.fn(),
  }),
  createViewableItemsHandler: () => jest.fn(),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.useFakeTimers()

describe('GenericHome', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  describe('With not displayed skeleton by default', () => {
    it('should display skeleton', async () => {
      useShowSkeletonSpy.mockReturnValueOnce(true)
      renderGenericHome({})
      await act(async () => {})

      expect(screen).toMatchSnapshot()
    })

    it('should display real content', async () => {
      renderGenericHome({})
      await act(async () => {})

      await waitFor(() => {
        expect(screen).toMatchSnapshot()
      })
    })

    it('should display offline page when not connected', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      renderGenericHome({})

      expect(await screen.findByText('Pas de réseau internet')).toBeOnTheScreen()
    })
  })

  describe('VideoCarouselModule', () => {
    describe('Home N-1', () => {
      it('should not display video in header if videoCarouselModule is the first module given', async () => {
        const modules = [formattedVideoCarouselModuleWithMultipleItems, formattedVenuesModule]

        renderGenericHome({ modules, thematicHeader: highlightHeaderFixture.thematicHeader })

        await waitFor(() => {
          const listHeaderContainer = screen.getByTestId('listHeader')
          const content = within(listHeaderContainer).queryByText('Les sorties du moment')

          expect(content).not.toBeOnTheScreen()
        })
      })

      it('should not display video in header if videoCarouselModule is not the first module given', async () => {
        const modules = [formattedVenuesModule, formattedVideoCarouselModuleWithMultipleItems]

        renderGenericHome({ modules, thematicHeader: highlightHeaderFixture.thematicHeader })

        await waitFor(() => {
          const listHeaderContainer = screen.getByTestId('listHeader')
          const content = within(listHeaderContainer).queryByText('Les sorties du moment')

          expect(content).not.toBeOnTheScreen()
        })
      })
    })

    describe('Home', () => {
      it('should display video in header if videoCarouselModule is the first module given', async () => {
        const modules = [formattedVideoCarouselModuleWithMultipleItems, formattedVenuesModule]

        renderGenericHome({ modules })

        await waitFor(() => {
          const listHeaderContainer = screen.getByTestId('listHeader')
          const content = within(listHeaderContainer).getByText('Les sorties du moment')

          expect(content).toBeOnTheScreen()
        })
      })

      it('should not display video in header if videoCarouselModule is not the first module given', async () => {
        const modules = [formattedVenuesModule, formattedVideoCarouselModuleWithMultipleItems]

        renderGenericHome({ modules })

        await waitFor(() => {
          const listHeaderContainer = screen.getByTestId('listHeader')
          const content = within(listHeaderContainer).queryByText('Les sorties du moment')

          expect(content).not.toBeOnTheScreen()
        })
      })
    })
  })
})

describe('GenericHome page - Analytics', () => {
  const scrollEventMiddle = {
    nativeEvent: {
      layoutMeasurement: { height: 1000 },
      contentOffset: { y: 400 }, // how far did we scroll
      contentSize: { height: 1600 },
    },
    persist: jest.fn(),
  }
  const scrollEventBottom = {
    nativeEvent: {
      layoutMeasurement: { height: 1000 },
      contentOffset: { y: 900 },
      contentSize: { height: 1600 },
    },
    persist: jest.fn(),
  }

  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should trigger logEvent "AllModulesSeen" when reaching the end', async () => {
    renderGenericHome({})
    const scrollView = screen.getByTestId('homeBodyScrollView')

    scrollView.props.onScroll(scrollEventMiddle)

    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()

    scrollView.props.onScroll(scrollEventBottom)

    await waitFor(() => {
      expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(1)
    })
  })

  it('should trigger batch logEvent "has_seen_all_the_homepage" when reaching the end on a Home', async () => {
    renderGenericHome({})
    const scrollView = screen.getByTestId('homeBodyScrollView')

    scrollView.props.onScroll(scrollEventMiddle)

    expect(BatchProfile.trackEvent).not.toHaveBeenCalled()

    scrollView.props.onScroll(scrollEventBottom)

    await waitFor(() => {
      expect(BatchProfile.trackEvent).toHaveBeenCalledWith('has_seen_all_the_homepage', {
        home_id: 'fake-id',
        home_type: 'mainHome',
      })
    })
  })

  it('should trigger batch logEvent "has_seen_all_the_homepage" when reaching the end on Thematic Home', async () => {
    renderGenericHome({ thematicHeader: highlightHeaderFixture.thematicHeader })
    const scrollView = screen.getByTestId('homeBodyScrollView')

    scrollView.props.onScroll(scrollEventMiddle)

    expect(BatchProfile.trackEvent).not.toHaveBeenCalled()

    scrollView.props.onScroll(scrollEventBottom)

    await waitFor(() => {
      expect(BatchProfile.trackEvent).toHaveBeenCalledWith('has_seen_all_the_homepage', {
        home_id: 'fake-id',
        home_type: 'thematicHome - Highlight',
      })
    })
  })

  it('should trigger logEvent "AllModulesSeen" only once', async () => {
    renderGenericHome({})
    const scrollView = await screen.findByTestId('homeBodyScrollView')

    // 1st scroll to bottom => trigger
    scrollView.props.onScroll(scrollEventBottom)
    await waitFor(() => {
      expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(1)
    })

    jest.clearAllMocks()

    // 2nd scroll to bottom => NOT trigger
    scrollView.props.onScroll(scrollEventMiddle)
    scrollView.props.onScroll(scrollEventBottom)

    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
  })

  it('should display spinner when end is reached', async () => {
    // To simulate progressive loading we need at least 11 modules
    const modules = [
      formattedVenuesModule,
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
    ]
    renderGenericHome({ modules })

    await act(async () => {})

    await act(async () => {
      const scrollView = screen.queryByTestId('homeBodyScrollView')
      scrollView?.props.onScroll(scrollEventBottom)
    })

    expect(screen.getByTestId('spinner')).toBeOnTheScreen()
  })
})

function renderGenericHome({
  modules = defaultModules,
  thematicHeader,
}: Partial<ComponentProps<typeof GenericHome>>) {
  return render(
    reactQueryProviderHOC(
      <GenericHome
        modules={modules}
        Header={Header}
        homeId={homeId}
        thematicHeader={thematicHeader}
      />
    )
  )
}
