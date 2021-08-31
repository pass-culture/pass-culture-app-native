import React from 'react'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { AsyncError } from 'libs/monitoring'
import { render, fireEvent } from 'tests/utils'

import { AsyncErrorBoundary } from '../AsyncErrorBoundary'

jest.mock('libs/monitoring/services')

describe('AsyncErrorBoundary component', () => {
  it('should render', () => {
    const resetErrorBoundary = jest.fn()
    const renderAPI = render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={resetErrorBoundary} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should go back on back arrow press', () => {
    const { getByTestId } = render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />
    )
    fireEvent.press(getByTestId('backArrow'))
    expect(mockGoBack).toHaveBeenCalled()
  })

  it('should call retry with AsyncError', async () => {
    const resetErrorBoundary = jest.fn()
    const retry = jest.fn()
    const { findByText } = render(
      <AsyncErrorBoundary
        error={new AsyncError('error', retry)}
        resetErrorBoundary={resetErrorBoundary}
      />
    )
    const button = await findByText('Réessayer')
    expect(retry).not.toHaveBeenCalled()
    fireEvent.press(button)
    expect(retry).toHaveBeenCalled()
  })
})
