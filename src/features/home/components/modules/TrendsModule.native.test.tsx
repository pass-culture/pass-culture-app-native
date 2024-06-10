import React from 'react'

import { TrendsModule } from 'features/home/components/modules/TrendsModule'
import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render } from 'tests/utils'

const trackingProps = {
  index: 1,
  homeEntryId: '4Fs4egA8G2z3fHgU2XQj3h',
  moduleId: formattedTrendsModule.id,
}

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('TrendsModule', () => {
  it('should not log analytics on render when FF is disabled', () => {
    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })

  it('should log analytics on render when FF is enabled', () => {
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
