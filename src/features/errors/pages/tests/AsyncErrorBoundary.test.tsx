import React from 'react'

import { canGoBack, goBack } from '__mocks__/@react-navigation/native'
import { errorMonitoring } from 'libs/errorMonitoring'
import { render, fireEvent } from 'tests/utils'

import {
  AsyncErrorBoundary,
  AsyncErrorBoundaryWithoutNavigation,
  AsyncError,
} from '../AsyncErrorBoundary'

jest.mock('libs/errorMonitoring/services')

describe('AsyncErrorBoundary component', () => {
  it('should render', () => {
    const resetErrorBoundary = jest.fn()
    const renderAPI = render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={resetErrorBoundary} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should call errorMonitoring.captureException() on render', () => {
    const resetErrorBoundary = jest.fn()
    const error = new Error('error')
    render(<AsyncErrorBoundary error={error} resetErrorBoundary={resetErrorBoundary} />)

    expect(errorMonitoring.captureException).toBeCalledWith(error)
  })

  it('should have back arrow if possible', () => {
    canGoBack.mockImplementation(() => true)
    const { getByTestId, queryByTestId } = render(
      <AsyncErrorBoundary
        backNavigation
        error={new Error('error')}
        resetErrorBoundary={jest.fn()}
      />
    )
    expect(queryByTestId('backArrow')).toBeTruthy()
    fireEvent.press(getByTestId('backArrow'))
    expect(goBack).toHaveBeenCalled()
  })

  it('should not have back arrow if impossible', () => {
    canGoBack.mockImplementation(() => false)
    const { queryByTestId } = render(
      <AsyncErrorBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />
    )
    expect(queryByTestId('backArrow')).toBeFalsy()
  })

  it('should not have back arrow if disabled', () => {
    const { queryByTestId } = render(
      <AsyncErrorBoundary
        backNavigation={false}
        error={new Error('error')}
        resetErrorBoundary={jest.fn()}
      />
    )
    expect(queryByTestId('backArrow')).toBeFalsy()
  })

  it('should not have back navigation in any case', () => {
    const { queryByTestId } = render(
      <AsyncErrorBoundaryWithoutNavigation
        backNavigation={true}
        error={new Error('error')}
        resetErrorBoundary={jest.fn()}
      />
    )
    expect(queryByTestId('backArrow')).toBeFalsy()
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
