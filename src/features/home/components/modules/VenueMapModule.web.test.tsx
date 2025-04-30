import React from 'react'

import { VenueMapModule } from 'features/home/components/modules/VenueMapModule'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('VenueMapModule', () => {
  it('should not display venue map block on web', () => {
    setFeatureFlags()
    render(<VenueMapModule />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })
})
