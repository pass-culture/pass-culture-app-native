import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { render, screen } from 'tests/utils'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { UserFavorite } from 'ui/svg/icons/UserFavorite'
import { Typo } from 'ui/theme'

describe('AppModalWithIllustration', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display remote illustration when new vision UI FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])

    render(
      <AppModalWithIllustration
        visible
        title="Modal title"
        remoteIllustration={{
          url: remoteIllustrationUrls.heartMosaicSmall,
          backgroundColor: 'positive01',
        }}
        Illustration={UserFavorite}
        hideModal={jest.fn()}>
        <Typo.Body>Modal content</Typo.Body>
      </AppModalWithIllustration>
    )

    expect(screen.getByTestId('remote-illustration')).toBeOnTheScreen()
  })
})
