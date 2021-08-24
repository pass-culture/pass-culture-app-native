import React from 'react'

import { canGoBack, goBack } from '__mocks__/@react-navigation/native'
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

  it('should have back arrow if possible', () => {
    // eslint-disable-next-line local-rules/independant-mocks
    canGoBack.mockImplementation(() => true)
    const { getByTestId, queryByTestId } = render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />
    )
    expect(queryByTestId('backArrow')).toBeTruthy()
    fireEvent.press(getByTestId('backArrow'))
    expect(goBack).toHaveBeenCalled()
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
