import React from 'react'
import { Linking } from 'react-native'

import { render, fireEvent, screen } from 'tests/utils/web'

import { ExternalLink } from '../ExternalLink.web'

const openURLSpy = jest.spyOn(Linking, 'openURL')
const someUrl = 'https://domain-that-does-not-exist.fr'

describe('ExternalLink', () => {
  afterEach(() => {
    openURLSpy.mockClear()
  })

  // FIXME(PC-21194): Fix this test (https://passculture.atlassian.net/browse/PC-21194)
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should open given url when text clicked', () => {
    render(<ExternalLink url={someUrl} />)

    fireEvent.click(screen.getByText(someUrl))

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
    expect(screen.getByText(someUrl)).toHaveAttribute('href', someUrl)
  })

  it('should open given url when text clicked and text not matching url', () => {
    render(<ExternalLink text="anchor text" url={someUrl} />)

    const anchorElement = screen.getByText('anchor')
    fireEvent.click(anchorElement)

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
    expect(anchorElement.closest('a')).toHaveAttribute('href', someUrl)
  })

  it('should open given url when icon clicked', () => {
    render(<ExternalLink url={someUrl} />)

    const icon = screen.getByTestId('externalSiteIcon')
    fireEvent.click(icon)

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
    expect(icon.closest('a')).toHaveAttribute('href', someUrl)
  })

  it('should display url with non breaking space when no text provided', () => {
    render(<ExternalLink url={someUrl} />)

    expect(screen.queryByText(someUrl)).toBeTruthy()
  })

  it('should display splitted text with non breaking space on first word', () => {
    render(<ExternalLink text="some text with several words" url={someUrl} />)

    expect(screen.queryByText('some')).toBeTruthy()
    expect(screen.queryByText('text with several words')).toBeTruthy()
  })
})
