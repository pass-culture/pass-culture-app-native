import React from 'react'

import { render, screen } from 'tests/utils'

import { NotEligibleEduConnect } from './NotEligibleEduConnect'

jest.mock('libs/firebase/analytics/analytics')

jest.mock(
  'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData',
  () => ({
    useNotEligibleEduConnectErrorData: jest.fn(() => ({
      title: 'EduConnect Error',
      description: 'You cannot use EduConnect.',
      descriptionAlignment: 'center',
      Illustration: () => null,
      primaryButton: {
        wording: 'Try Again',
        navigateTo: { screen: 'SelectIDOrigin', params: {} },
      },
      isGoHomeTertiaryButtonVisible: true,
    })),
  })
)

describe('NotEligibleEduConnect', () => {
  it('should render correctly', async () => {
    render(
      <NotEligibleEduConnect
        error={{ name: 'Error', message: 'ErrorMessage' }}
        resetErrorBoundary={jest.fn()}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should display the correct title and description', () => {
    render(
      <NotEligibleEduConnect
        error={{ name: 'Error', message: 'ErrorMessage' }}
        resetErrorBoundary={jest.fn()}
      />
    )

    expect(screen.getByText('EduConnect Error')).toBeTruthy()
    expect(screen.getByText('You cannot use EduConnect.')).toBeTruthy()
  })

  it('should display a tertiary button if "isGoHomeTertiaryButtonVisible" is true', () => {
    render(
      <NotEligibleEduConnect
        error={{ name: 'Error', message: 'ErrorMessage' }}
        resetErrorBoundary={jest.fn()}
      />
    )

    const tertiaryButton = screen.getByText('Retourner à l’accueil')

    expect(tertiaryButton).toBeTruthy()
  })

  it('should display a primary button when primaryButton is defined', () => {
    render(
      <NotEligibleEduConnect
        error={{ name: 'Error', message: 'ErrorMessage' }}
        resetErrorBoundary={jest.fn()}
      />
    )

    const primaryButton = screen.getByText('Try Again')

    expect(primaryButton).toBeTruthy()
  })
})
