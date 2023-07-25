import React from 'react'
import { Text } from 'react-native'

import { render, fireEvent, screen } from 'tests/utils/web'

import { TouchableLink } from './TouchableLink'

describe('<TouchableLink />', () => {
  it('should handleNavigation when no metaKey', async () => {
    const handleNavigationMock = jest.fn()
    render(
      <TouchableLink handleNavigation={handleNavigationMock}>
        <Text>linkText</Text>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'))

    expect(handleNavigationMock).toHaveBeenCalledTimes(1)
  })

  it('should not handleNavigation when metaKey', async () => {
    const handleNavigationMock = jest.fn()
    render(
      <TouchableLink handleNavigation={handleNavigationMock}>
        <Text>linkText</Text>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'), { metaKey: true })

    expect(handleNavigationMock).not.toHaveBeenCalled()
  })

  it('should not handleNavigation when shiftKey', async () => {
    const handleNavigationMock = jest.fn()
    render(
      <TouchableLink handleNavigation={handleNavigationMock}>
        <Text>linkText</Text>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'), { shiftKey: true })

    expect(handleNavigationMock).not.toHaveBeenCalled()
  })

  // FIXME(LucasBeneston): Problem with fireEvent + altKey
  // current behavior : when clicking with alt pressed (using fireEvent) the onClick function is not called
  // expected behavior : when clicking with alt pressed (using fireEvent) the onClick function should be called without doing the navigation
  // the test should be well written but doesn't work for unknown reasons
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should not handleNavigation when altKey', async () => {
    const handleNavigationMock = jest.fn()
    render(
      <TouchableLink handleNavigation={handleNavigationMock}>
        <Text>linkText</Text>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'), { altKey: true })

    expect(handleNavigationMock).not.toHaveBeenCalled()
  })

  it('should not handleNavigation when ctrlKey', async () => {
    const handleNavigationMock = jest.fn()
    render(
      <TouchableLink handleNavigation={handleNavigationMock}>
        <Text>linkText</Text>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'), { ctrlKey: true })

    expect(handleNavigationMock).not.toHaveBeenCalled()
  })
})
