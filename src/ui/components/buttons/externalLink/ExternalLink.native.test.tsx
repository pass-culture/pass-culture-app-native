import React from 'react'
import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { fireEvent, render } from 'tests/utils'

import { ExternalLink } from './ExternalLink'

const openURLSpy = jest.spyOn(Linking, 'openURL')
const someUrl = 'https://domain-that-does-not-exist.fr'

describe('ExternalLink', () => {
  it('should open given url when text clicked', () => {
    const { getByText } = render(<ExternalLink url={someUrl} />)
    fireEvent.press(getByText('\u00a0' + someUrl))
    waitForExpect(() => {
      expect(openURLSpy).toHaveBeenCalledWith(someUrl)
      expect(openURLSpy).toHaveBeenCalledTimes(1)
    })
    openURLSpy.mockClear()
  })
  it('should open given url when text clicked and text not matching url', () => {
    const text = 'anchor text'
    const { getByText } = render(<ExternalLink text={text} url={someUrl} />)
    fireEvent.press(getByText('\u00a0anchor'))
    expect(openURLSpy).toHaveBeenCalledWith(someUrl)
    expect(openURLSpy).toHaveBeenCalledTimes(1)
    openURLSpy.mockClear()
  })
  it('should open given url when icon clicked', () => {
    const { getByTestId } = render(<ExternalLink url={someUrl} />)
    fireEvent.press(getByTestId('externalSiteIcon'))
    expect(openURLSpy).toHaveBeenCalledWith(someUrl)
    expect(openURLSpy).toHaveBeenCalledTimes(1)
    openURLSpy.mockClear()
  })

  it('should display url with non breaking space when no text provided', () => {
    const text = undefined
    const { queryByText } = render(<ExternalLink text={text} url={someUrl} />)
    expect(queryByText('\u00a0' + someUrl)).toBeTruthy()
  })

  it('should display splitted text with non breaking space on first word', () => {
    const text = 'some text with several words'
    const { queryByText } = render(<ExternalLink text={text} url={someUrl} />)
    expect(queryByText('\u00a0some')).toBeTruthy()
    expect(queryByText(' text with several words')).toBeTruthy()
  })
})
