import React from 'react'
import { Linking } from 'react-native'

import { act, fireEvent, render, screen } from 'tests/utils'

import { ExternalLink } from './ExternalLink'

const openURLSpy = jest.spyOn(Linking, 'openURL')
const someUrl = 'https://domain-that-does-not-exist.fr'

describe('ExternalLink', () => {
  it('should open given url when text clicked', async () => {
    render(<ExternalLink url={someUrl} />)

    await act(async () =>
      fireEvent.press(screen.getByLabelText('Nouvelle fenêtre\u00a0: ' + someUrl))
    )

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
  })

  it('should open given url when text clicked and text not matching url', () => {
    render(<ExternalLink text="anchor text" url={someUrl} />)

    fireEvent.press(screen.getByLabelText('Nouvelle fenêtre\u00a0: anchor text'))

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
  })

  it('should open given url when icon clicked', () => {
    render(<ExternalLink url={someUrl} />)

    fireEvent.press(screen.getByTestId('externalSiteIcon'))

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
  })
})
