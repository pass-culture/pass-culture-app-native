import React from 'react'

import { ChroniclesWritersModal } from 'features/chronicle/pages/ChroniclesWritersModal/ChroniclesWritersModal'
import { render, screen } from 'tests/utils'

describe('<ChroniclesWritersModal/>', () => {
  it('should render correctly', () => {
    render(
      <ChroniclesWritersModal isVisible closeModal={jest.fn} onShowRecoButtonPress={jest.fn()} />
    )

    expect(
      screen.getByText('Les avis du book club sont écrits par des jeunes passionnés de lecture.')
    ).toBeOnTheScreen()
  })
})
