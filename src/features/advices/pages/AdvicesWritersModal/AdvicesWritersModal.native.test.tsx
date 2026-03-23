import React from 'react'

import { adviceVariantInfoFixture } from 'features/advices/fixtures/adviceVariantInfo.fixture'
import { AdvicesWritersModal } from 'features/advices/pages/AdvicesWritersModal/AdvicesWritersModal'
import { render, screen } from 'tests/utils'

describe('<ChroniclesWritersModal/>', () => {
  it('should render correctly', () => {
    render(
      <AdvicesWritersModal
        isVisible
        closeModal={jest.fn}
        onShowRecoButtonPress={jest.fn()}
        modalWording={adviceVariantInfoFixture.modalWording}
        buttonWording={adviceVariantInfoFixture.buttonWording}
      />
    )

    expect(
      screen.getByText('Les avis du book club sont écrits par des jeunes passionnés de lecture.')
    ).toBeOnTheScreen()
  })
})
