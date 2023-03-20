import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { ExternalLink } from './ExternalLink'

const openURLSpy = jest.spyOn(Linking, 'openURL')
const someUrl = 'https://domain-that-does-not-exist.fr'

describe('ExternalLink', () => {
  afterEach(() => {
    openURLSpy.mockClear()
  })

  it('should open given url when text clicked', async () => {
    render(<ExternalLink url={someUrl} />)

    fireEvent.press(screen.getByText('\u00a0' + someUrl))

    await waitFor(() => {
      expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
    })
  })

  it('should open given url when text clicked and text not matching url', () => {
    render(<ExternalLink text="anchor text" url={someUrl} />)

    fireEvent.press(screen.getByText('\u00a0anchor'))

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
  })

  it('should open given url when icon clicked', () => {
    render(<ExternalLink url={someUrl} />)

    fireEvent.press(screen.getByTestId('externalSiteIcon'))

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
  })

  it('should display url with non breaking space when no text provided', () => {
    render(<ExternalLink url={someUrl} />)

    expect(screen.queryByText('\u00a0' + someUrl)).toBeTruthy()
  })

  it('should display splitted text with non breaking space on first word', () => {
    render(<ExternalLink text="some text with several words" url={someUrl} />)

    expect(screen.queryByText('\u00a0some')).toBeTruthy()
    expect(screen.queryByText(' text with several words')).toBeTruthy()
  })
})
