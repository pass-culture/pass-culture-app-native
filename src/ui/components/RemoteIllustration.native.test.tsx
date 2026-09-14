import React from 'react'
import { View as MockView } from 'react-native'

import { fireEvent, render, screen } from 'tests/utils'

import { RemoteIllustration } from './RemoteIllustration'

jest.mock('@d11/react-native-fast-image', () => {
  return function MockFastImage(props: Record<string, unknown>) {
    return <MockView {...props} />
  }
})

jest.mock('ui/svg/ErrorServer', () => ({
  ErrorServer: () => <MockView testID="error-server" />,
}))

describe('RemoteIllustration', () => {
  const defaultProps = {
    url: 'https://example.com/image.png',
    backgroundColor: 'information03' as const,
  }

  it('should display transparent background when image not loaded', () => {
    render(<RemoteIllustration {...defaultProps} />)

    const container = screen.getByTestId('remote-illustration-container')

    expect(container.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: 'transparent',
      })
    )
  })

  it('should display image with the provided URL and background color when image loaded without error', () => {
    render(<RemoteIllustration {...defaultProps} />)

    const image = screen.getByTestId('remote-illustration')
    fireEvent(image, 'onLoad')

    const container = screen.getByTestId('remote-illustration-container')

    expect(container.props.style).toEqual(
      expect.objectContaining({
        //information03
        backgroundColor: '#c1a3ff',
      })
    )
    expect(image.props.source).toEqual({ uri: defaultProps.url })
  })

  it('should display ErrorServer image and transparent background when image loaded with error', () => {
    render(<RemoteIllustration {...defaultProps} />)

    const container = screen.getByTestId('remote-illustration-container')
    const image = screen.getByTestId('remote-illustration')
    fireEvent(image, 'onError')

    expect(screen.getByTestId('error-server')).toBeOnTheScreen()
    expect(container.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: 'transparent',
      })
    )
  })
})
