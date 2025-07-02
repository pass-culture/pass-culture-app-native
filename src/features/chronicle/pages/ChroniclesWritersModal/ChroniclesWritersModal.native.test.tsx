import React from 'react'

import { ChroniclesWritersModal } from 'features/chronicle/pages/ChroniclesWritersModal/ChroniclesWritersModal'
import { chronicleVariantInfoFixture } from 'features/offer/fixtures/chronicleVariantInfo'
import { render, screen } from 'tests/utils'

describe('<ChroniclesWritersModal/>', () => {
  it('should render correctly', () => {
    render(
      <ChroniclesWritersModal
        isVisible
        closeModal={jest.fn}
        onShowRecoButtonPress={jest.fn()}
        variantInfo={chronicleVariantInfoFixture}
      />
    )

    expect(
      screen.getByText('Les avis du Book Club sont écrits par des jeunes passionnés de lecture.')
    ).toBeOnTheScreen()
  })
})
