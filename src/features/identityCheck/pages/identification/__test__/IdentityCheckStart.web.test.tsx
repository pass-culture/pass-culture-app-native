import React from 'react'
import { ThemeProvider } from 'styled-components/native'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { IdentityCheckStart } from 'features/identityCheck/pages/identification/IdentityCheckStart'
import { ComputedTheme } from 'libs/styled/ThemeProvider'
import { computedTheme } from 'tests/computedTheme'
import { fireEvent, render } from 'tests/utils/web'

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

describe('<IdentityCheckStart/>', () => {
  it('should render correctly', () => {
    const renderAPIwithMobileViewport = render(
      <IdentityCheckStart />,
      withCustomTheme({ isDesktopViewport: false, isMobileViewport: true })
    )
    const renderAPIwithDesktopViewport = render(
      <IdentityCheckStart />,
      withCustomTheme({ isDesktopViewport: true, isMobileViewport: false })
    )
    expect(renderAPIwithDesktopViewport).toMatchDiffSnapshot(renderAPIwithMobileViewport)
  })

  describe('is not mobile viewport', () => {
    it(`should navigate to next screen on press "Vérification par smartphone" and "J'ai compris"`, () => {
      const { getByText } = render(
        <IdentityCheckStart />,
        withCustomTheme({ isDesktopViewport: true, isMobileViewport: false })
      )
      expect(mockNavigateToNextScreen).not.toHaveBeenCalled()

      fireEvent.click(getByText('Vérification par smartphone'))
      fireEvent.click(getByText("J'ai compris"))
      expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
    })

    it('should navigate to DMS modal when user press "Identification par le site Démarches-Simplifiées"', () => {
      const { getByText, getByTestId } = render(
        <IdentityCheckStart />,
        withCustomTheme({ isDesktopViewport: true, isMobileViewport: false })
      )
      expect(mockNavigateToNextScreen).not.toHaveBeenCalled()

      fireEvent.click(getByTestId('Identification par le site Démarches-Simplifiées'))
      getByText('Je suis de nationalité française')
      getByText('Je suis de nationalité étrangère')
    })
  })

  describe('is mobile viewport', () => {
    it(`should navigate to next screen on press "Commencer la vérification" and "J'ai compris"`, () => {
      const { getByText } = render(
        <IdentityCheckStart />,
        withCustomTheme({ isDesktopViewport: false, isMobileViewport: true })
      )
      expect(mockNavigateToNextScreen).not.toHaveBeenCalled()

      fireEvent.click(getByText('Commencer la vérification'))
      fireEvent.click(getByText("J'ai compris"))
      expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
    })

    it('should navigate to DMS modal when user press "Transmettre un document"', () => {
      const { getByText, getByTestId } = render(
        <IdentityCheckStart />,
        withCustomTheme({ isDesktopViewport: false, isMobileViewport: true })
      )
      expect(mockNavigateToNextScreen).not.toHaveBeenCalled()

      fireEvent.click(getByTestId('Transmettre un document'))
      getByText('Je suis de nationalité française')
      getByText('Je suis de nationalité étrangère')
    })
  })
})

function withCustomTheme(customTheme: Partial<ComputedTheme>) {
  const Wrapper: React.FC = ({ children }) => (
    <ThemeProvider theme={{ ...computedTheme, ...customTheme }}>{children}</ThemeProvider>
  )
  return { wrapper: Wrapper }
}
