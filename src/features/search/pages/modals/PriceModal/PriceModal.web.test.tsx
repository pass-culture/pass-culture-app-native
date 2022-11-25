import React from 'react'

import { render, act, checkAccessibilityFor } from 'tests/utils/web'

import { PriceModal } from './PriceModal'

jest.mock('react-query')

jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: {
      isBeneficiary: true,
      domainsCredit: { all: { initial: 8000, remaining: 7000 } },
    },
  })),
}))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('<PriceModal/>', () => {
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

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
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
      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
