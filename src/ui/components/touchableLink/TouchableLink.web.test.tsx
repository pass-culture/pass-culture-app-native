import React from 'react'

import { render, fireEvent, screen } from 'tests/utils/web'
import { Typo } from 'ui/theme'

import { TouchableLink } from './TouchableLink'

const handleNavigationMock = jest.fn()

describe('<TouchableLink />', () => {
  it('should handleNavigation when no metaKey', async () => {
    render(
      <TouchableLink handleNavigation={handleNavigationMock}>
        <Typo.Body>linkText</Typo.Body>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'))

    expect(handleNavigationMock).toHaveBeenCalledTimes(1)
  })

  it('should not call handleNavigation when disabled', async () => {
    render(
      <TouchableLink handleNavigation={handleNavigationMock} disabled>
        <Text>linkText</Text>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'))

    expect(handleNavigationMock).not.toHaveBeenCalled()
  })

  it('should not handleNavigation when metaKey', async () => {
    render(
      <TouchableLink handleNavigation={handleNavigationMock}>
        <Text>linkText</Text>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'), { metaKey: true })

    expect(handleNavigationMock).not.toHaveBeenCalled()
  })

  it('should not handleNavigation when shiftKey', async () => {
    render(
      <TouchableLink handleNavigation={handleNavigationMock}>
        <Text>linkText</Text>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'), { shiftKey: true })

    expect(handleNavigationMock).not.toHaveBeenCalled()
  })

  it('should not handleNavigation when altKey', async () => {
    render(
      <TouchableLink handleNavigation={handleNavigationMock}>
        <Text>linkText</Text>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'), { altKey: true })

    expect(handleNavigationMock).not.toHaveBeenCalled()
  })

  it('should not handleNavigation when ctrlKey', async () => {
    render(
      <TouchableLink handleNavigation={handleNavigationMock}>
        <Text>linkText</Text>
      </TouchableLink>
    )

    fireEvent.click(screen.getByText('linkText'), { ctrlKey: true })

    expect(handleNavigationMock).not.toHaveBeenCalled()
  })
})
