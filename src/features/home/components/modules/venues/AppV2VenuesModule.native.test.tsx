import React from 'react'

import { AppV2VenuesModule } from 'features/home/components/modules/venues/AppV2VenuesModule'
import { ModuleData } from 'features/home/types'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const mockFeatureFlag = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)
const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

const props = {
  moduleId: 'fakemoduleid',
  index: 1,
  data: {
    playlistItems: venuesSearchFixture.hits,
    nbPlaylistResults: venuesSearchFixture.hits.length,
    moduleId: 'fakemoduleid',
  },
  homeEntryId: 'homeEntryId',
}

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('<AppV2VenuesModule />', () => {
  it('should log ModuleDisplayedOnHomePage event when seeing the module', () => {
    renderAppV2VenuesModule()

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      moduleId: 'fakemoduleid',
      moduleType: 'venuesPlaylistAppV2',
      index: 1,
      homeEntryId: 'homeEntryId',
      venues: ['5543', '5544', '5545', '5546'],
    })
  })

  it('should not render list when data is undefined', () => {
    renderAppV2VenuesModule({ data: undefined })

    expect(
      screen.queryByText('Les lieux culturels à proximité'.toUpperCase())
    ).not.toBeOnTheScreen()
  })

  describe('When shouldApplyGraphicRedesign remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldApplyGraphicRedesign: false,
      })
    })

    it('should return 4 venues maximum when home id not in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      renderAppV2VenuesModule()

      expect(screen.queryByText('Le Petit Rintintin 5')).not.toBeOnTheScreen()
    })

    it('should not render list when home id in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      renderAppV2VenuesModule({ homeEntryId: '4Fs4egA8G2z3fHgU2XQj3h' })

      expect(
        screen.queryByText('Les lieux culturels à proximité'.toUpperCase())
      ).not.toBeOnTheScreen()
    })
  })

  describe('When shouldApplyGraphicRedesign remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldApplyGraphicRedesign: true,
      })
    })

    it('should return 4 venues maximum when home id not in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      renderAppV2VenuesModule()

      expect(screen.queryByText('Le Petit Rintintin 5')).not.toBeOnTheScreen()
    })

    it('should return 4 venues maximum when home id in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      renderAppV2VenuesModule({ homeEntryId: '4Fs4egA8G2z3fHgU2XQj3h' })

      expect(screen.queryByText('Le Petit Rintintin 5')).not.toBeOnTheScreen()
    })
  })

  it('should not render list when feature flag deactivated', () => {
    mockFeatureFlag.mockReturnValueOnce(false)
    renderAppV2VenuesModule()

    expect(
      screen.queryByText('Les lieux culturels à proximité'.toUpperCase())
    ).not.toBeOnTheScreen()
  })
})

const renderAppV2VenuesModule = (
  additionalProps: { data?: ModuleData; homeEntryId?: string } = {}
) => render(reactQueryProviderHOC(<AppV2VenuesModule {...props} {...additionalProps} />))
