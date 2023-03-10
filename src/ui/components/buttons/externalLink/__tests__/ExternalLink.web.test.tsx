import React from 'react'
import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { render, fireEvent, screen } from 'tests/utils/web'

import { ExternalLink } from '../ExternalLink.web'

const openURLSpy = jest.spyOn(Linking, 'openURL')
const someUrl = 'https://domain-that-does-not-exist.fr'

describe('ExternalLink', () => {
  it('should open given url when text clicked', () => {
    render(<ExternalLink url={someUrl} />)
    fireEvent.click(screen.getByText(someUrl))
    waitForExpect(() => {
      expect(openURLSpy).toHaveBeenCalledWith(someUrl)
      expect(openURLSpy).toHaveBeenCalledTimes(1)
      expect(screen.getByText(someUrl)).toHaveAttribute('href', someUrl)
    })
    openURLSpy.mockClear()
  })
  it('should open given url when text clicked and text not matching url', () => {
    const text = 'anchor text'
    render(<ExternalLink text={text} url={someUrl} />)
    const anchorElement = screen.getByText('anchor')
    fireEvent.click(anchorElement)
    expect(openURLSpy).toHaveBeenCalledWith(someUrl)
    expect(openURLSpy).toHaveBeenCalledTimes(1)
    expect(anchorElement.closest('a')).toHaveAttribute('href', someUrl)
    openURLSpy.mockClear()
  })
  it('should open given url when icon clicked', () => {
    render(<ExternalLink url={someUrl} />)
    const icon = screen.getByTestId('externalSiteIcon')
    fireEvent.click(icon)
    expect(openURLSpy).toHaveBeenCalledWith(someUrl)
    expect(openURLSpy).toHaveBeenCalledTimes(1)
    expect(icon.closest('a')).toHaveAttribute('href', someUrl)
    openURLSpy.mockClear()
  })

  it('should display url with non breaking space when no text provided', () => {
    const text = undefined
    render(<ExternalLink text={text} url={someUrl} />)
    expect(screen.queryByText(someUrl)).toBeTruthy()
  })

  it('should display splitted text with non breaking space on first word', () => {
    const text = 'some text with several words'
    render(<ExternalLink text={text} url={someUrl} />)
    expect(screen.queryByText('some')).toBeTruthy()
    expect(screen.queryByText('text with several words')).toBeTruthy()
  })
})
