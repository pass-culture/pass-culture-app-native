import React from 'react'

import { VenueMapModule } from 'features/home/components/modules/VenueMapModule'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils/web'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider', () => ({
  useRemoteConfigContext: jest.fn().mockReturnValue({ shouldLogInfo: false }),
}))

describe('VenueMapModule', () => {
  it('should not display venue map block on web', () => {
    render(<VenueMapModule />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })
})
