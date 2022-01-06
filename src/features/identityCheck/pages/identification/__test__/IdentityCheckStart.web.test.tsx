import React from 'react'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { IdentityCheckStart } from 'features/identityCheck/pages/identification/IdentityCheckStart/IdentityCheckStart'
import { fireEvent, render } from 'tests/utils/web'

jest.mock('react-query')
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

describe('<IdentityCheckStart/>', () => {
  it('should render correctly', () => {
    const renderWithDefaultMobileViewport = render(<IdentityCheckStart />)
    const renderWithDesktopViewport = render(<IdentityCheckStart />, {
      theme: { isDesktopViewport: true, isMobileViewport: false },
    })
    expect(renderWithDesktopViewport).toMatchDiffSnapshot(renderWithDefaultMobileViewport)
  })

  describe('is not mobile viewport', () => {
    it(`should navigate to "Quelques conseils" screen on press "Vérification par smartphone"`, () => {
      const { getByText, queryByText } = render(<IdentityCheckStart />, {
        theme: { isDesktopViewport: true, isMobileViewport: false },
      })
      fireEvent.click(getByText('Vérification par smartphone'))
      expect(queryByText('Quelques conseils')).toBeTruthy()
    })

    it('should navigate to DMS modal when user press "Identification par le site Démarches-Simplifiées"', () => {
      const { getByText, queryByText } = render(<IdentityCheckStart />, {
        theme: { isDesktopViewport: true, isMobileViewport: false },
      })
      fireEvent.click(getByText('Identification par le site Démarches-Simplifiées'))
      expect(queryByText('Je suis de nationalité française')).toBeTruthy()
      expect(queryByText('Je suis de nationalité étrangère')).toBeTruthy()
    })
  })

  describe('is mobile viewport', () => {
    it(`should navigate to "Quelques conseils" screen on press "Commencer la vérification" and "J'ai compris"`, () => {
      const { getByText, queryByText } = render(<IdentityCheckStart />)
      fireEvent.click(getByText('Commencer la vérification'))
      expect(queryByText('Quelques conseils')).toBeTruthy()
    })

    it('should navigate to DMS modal when user press "Transmettre un document"', () => {
      const { getByText, queryByText } = render(<IdentityCheckStart />)
      fireEvent.click(getByText('Transmettre un document'))
      expect(queryByText('Je suis de nationalité française')).toBeTruthy()
      expect(queryByText('Je suis de nationalité étrangère')).toBeTruthy()
    })
  })
})
