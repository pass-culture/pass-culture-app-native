import React from 'react'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/identificationStart/SelectIDOrigin.web'
import { render } from 'tests/utils'

jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))
it('should render correctly', () => {
  const renderWithDefaultMobileViewport = render(<SelectIDOrigin />)
  const renderWithDesktopViewport = render(<SelectIDOrigin />, {
    theme: { isDesktopViewport: true, isMobileViewport: false },
  })
  expect(renderWithDesktopViewport).toMatchDiffSnapshot(renderWithDefaultMobileViewport)
})
