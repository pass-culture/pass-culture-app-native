import React from 'react'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { AsyncError } from 'libs/monitoring'
import { render, fireEvent, checkAccessibilityFor, screen } from 'tests/utils/web'

import { AsyncErrorBoundary } from './AsyncErrorBoundary'

jest.mock('libs/monitoring/services')

const resetErrorBoundary = jest.fn()

describe('AsyncErrorBoundary component', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={resetErrorBoundary} />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })

  it('should render correctly', () => {
    const { container } = render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={resetErrorBoundary} />
    )

    expect(container).toMatchSnapshot()
  })

  it('should have back arrow if possible', () => {
    render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={resetErrorBoundary} />
    )

    expect(screen.getByTestId('Revenir en arrière')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should call retry with AsyncError', async () => {
    const retry = jest.fn()
    render(
      <AsyncErrorBoundary
        error={new AsyncError('error', { retry })}
        resetErrorBoundary={resetErrorBoundary}
      />
    )

    expect(retry).not.toHaveBeenCalled()

    const button = await screen.findByText('Réessayer')
    fireEvent.click(button)

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
