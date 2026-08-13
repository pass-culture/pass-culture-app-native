import React from 'react'

import { adviceVariantInfoFixture } from 'features/advices/fixtures/adviceVariantInfo.fixture'
import { AdvicesWritersModal } from 'features/advices/pages/AdvicesWritersModal/AdvicesWritersModal'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

describe('<AdvicesWritersModal/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    render(
      <AdvicesWritersModal
        isVisible
        closeModal={jest.fn}
        onButtonPress={jest.fn()}
        modalWording={adviceVariantInfoFixture.modalWording}
        buttonWording={adviceVariantInfoFixture.buttonWording}
      />
    )

    expect(
      screen.getByText('Les avis du book club sont écrits par des jeunes passionnés de lecture.')
    ).toBeOnTheScreen()
  })

  it('should display remote illustration when new vision UI FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])

    render(
      <AdvicesWritersModal
        isVisible
        closeModal={jest.fn}
        onButtonPress={jest.fn()}
        modalWording={adviceVariantInfoFixture.modalWording}
        buttonWording={adviceVariantInfoFixture.buttonWording}
      />
    )

    expect(screen.getByTestId('remote-illustration')).toBeOnTheScreen()
  })
})
