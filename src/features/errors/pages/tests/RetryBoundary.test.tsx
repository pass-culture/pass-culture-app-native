import { render } from '@testing-library/react-native'
import React from 'react'

import { canGoBack } from '__mocks__/@react-navigation/native'

import { RetryBoundary } from '../RetryBoundary'

describe('RetryBoundary component', () => {
  it('should render', () => {
    const resetErrorBoundary = jest.fn()
    const component = render(
      <RetryBoundary error={new Error('error')} resetErrorBoundary={resetErrorBoundary} />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should have back arrow if possible', () => {
    canGoBack.mockImplementation(() => true)
    const { queryByTestId } = render(
      <RetryBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />
    )
    expect(queryByTestId('backArrow')).toBeTruthy()
  })
  it('should not have back arrow if impossible', () => {
    canGoBack.mockImplementation(() => false)
    const { queryByTestId } = render(
      <RetryBoundary error={new Error('error')} resetErrorBoundary={jest.fn()} />
    )
    expect(queryByTestId('backArrow')).toBeFalsy()
  })
})
