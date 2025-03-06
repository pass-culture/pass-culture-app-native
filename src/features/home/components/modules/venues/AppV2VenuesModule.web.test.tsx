import React, { ComponentProps } from 'react'

import { AppV2VenuesModule } from 'features/home/components/modules/venues/AppV2VenuesModule.web'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { Layout } from 'libs/contentful/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

const props = {
  data: {
    playlistItems: venuesSearchFixture.hits,
    nbPlaylistResults: venuesSearchFixture.hits.length,
    moduleId: 'fakemoduleid',
  },
  moduleId: 'fakemoduleid',
  displayParameters: {
    title: 'Toto',
    layout: 'three-items' as Layout,
    minOffers: 5,
  },
  homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
  index: 1,
}

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<AppV2VenuesModule />', () => {
  it('should return 6 venues maximum on web desktop', () => {
    renderAppV2VenuesModule({ isDesktopViewport: true })

    expect(screen.getByText('Le Petit Rintintin 5')).toBeInTheDocument()
  })

  it('should return 4 venues maximum on web mobile', () => {
    setFeatureFlags()

    renderAppV2VenuesModule({ isDesktopViewport: false })

    expect(screen.queryByText('Le Petit Rintintin 5')).not.toBeInTheDocument()
  })
})

type RenderAppV2VenuesModuleType = Partial<ComponentProps<typeof AppV2VenuesModule>> & {
  isDesktopViewport?: boolean
}

const renderAppV2VenuesModule = ({
  isDesktopViewport,
  ...additionalProps
}: RenderAppV2VenuesModuleType = {}) =>
  render(reactQueryProviderHOC(<AppV2VenuesModule {...props} {...additionalProps} />), {
    theme: { isDesktopViewport: isDesktopViewport ?? false },
  })
