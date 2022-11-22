import React from 'react'

import { render, act } from 'tests/utils/web'

import { PriceModal } from './PriceModal'

jest.mock('react-query')

describe('PriceModal component', () => {
  it('should display mobile header modal if mobile viewport', async () => {
    const { getByTestId } = render(
      <PriceModal
        title="Prix"
        accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
        isVisible
        hideModal={jest.fn()}
      />,
      {
        theme: { isDesktopViewport: false, isMobileViewport: true },
      }
    )

    const pageHeader = getByTestId('pageHeader')

    await act(async () => {
      expect(pageHeader).toBeTruthy()
    })
  })
})
