import React from 'react'
import { Linking } from 'react-native'

import { act, render, screen, userEvent } from 'tests/utils'

import { ExternalLink } from './ExternalLink'

const openURLSpy = jest.spyOn(Linking, 'openURL')
const someUrl = 'https://domain-that-does-not-exist.fr'

jest.mock('libs/firebase/analytics/analytics')
const user = userEvent.setup()
jest.useFakeTimers()

describe('ExternalLink', () => {
  it('should open given url when text clicked', async () => {
    render(<ExternalLink url={someUrl} />)

    await act(async () => user.press(screen.getByLabelText('Nouvelle fenêtre\u00a0: ' + someUrl)))

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
  })

  it('should open given url when text clicked and text not matching url', async () => {
    render(<ExternalLink text="anchor text" url={someUrl} />)

    await user.press(screen.getByLabelText('Nouvelle fenêtre\u00a0: anchor text'))

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
  })

  it('should open given url when icon clicked', async () => {
    render(<ExternalLink url={someUrl} />)

    await user.press(screen.getByTestId('externalSiteIcon'))

    expect(openURLSpy).toHaveBeenNthCalledWith(1, someUrl)
  })

  it('should not display Icon when withIcon is false', () => {
    render(<ExternalLink text="some text with several words" url={someUrl} withIcon={false} />)

    expect(screen.queryByTestId('externalSiteIcon')).not.toBeOnTheScreen()
  })
})
