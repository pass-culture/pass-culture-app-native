import React from 'react'

import { TrendsModule } from 'features/home/components/modules/TrendsModule'
import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { render } from 'tests/utils'

const trackingProps = {
  index: 1,
  homeEntryId: '4Fs4egA8G2z3fHgU2XQj3h',
  moduleId: formattedTrendsModule.id,
}

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

describe('TrendsModule', () => {
  it('should not log analytics on render when FF is disabled', () => {
    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })

  describe('When shouldApplyGraphicRedesign remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldApplyGraphicRedesign: false,
      })
    })

    it('should log analytics on render when FF is enabled and home id not in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
      const trackingPropsWithoutRedesign = {
        ...trackingProps,
        homeEntryId: 'homeEntryId',
      }
      render(<TrendsModule {...formattedTrendsModule} {...trackingPropsWithoutRedesign} />)

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledWith({
        moduleId: 'g6VpeYbOosfALeqR55Ah6',
        moduleType: 'trends',
        index: 1,
        homeEntryId: 'homeEntryId',
      })
    })

    it('should log analytics on render when FF is enabled and home id in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
      render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledTimes(0)
    })
  })

  describe('When shouldApplyGraphicRedesign remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldApplyGraphicRedesign: true,
      })
    })

    it('should log analytics on render when FF is enabled and home id not in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
      const trackingPropsWithoutRedesign = {
        ...trackingProps,
        homeEntryId: 'homeEntryId',
      }
      render(<TrendsModule {...formattedTrendsModule} {...trackingPropsWithoutRedesign} />)

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledWith({
        moduleId: 'g6VpeYbOosfALeqR55Ah6',
        moduleType: 'trends',
        index: 1,
        homeEntryId: 'homeEntryId',
      })
    })

    it('should log analytics on render when FF is enabled and home id in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
      render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledWith({
        moduleId: 'g6VpeYbOosfALeqR55Ah6',
        moduleType: 'trends',
        index: 1,
        homeEntryId: '4Fs4egA8G2z3fHgU2XQj3h',
      })
    })
  })
})
