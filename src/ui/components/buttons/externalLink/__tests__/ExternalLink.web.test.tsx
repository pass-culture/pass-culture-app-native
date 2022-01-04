import React from 'react'
import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { render, fireEvent } from 'tests/utils/web'

import { ExternalLink } from '../ExternalLink.web'

const openURLSpy = jest.spyOn(Linking, 'openURL')
const someUrl = 'https://domain-that-does-not-exist.fr'

describe('ExternalLink', () => {
  it('should open given url when text clicked', () => {
    const { getByText } = render(<ExternalLink url={someUrl} />)
    fireEvent.click(getByText(someUrl))
    waitForExpect(() => {
      expect(openURLSpy).toHaveBeenCalledWith(someUrl)
      expect(openURLSpy).toHaveBeenCalledTimes(1)
    })
    openURLSpy.mockClear()
  })
  it('should open given url when text clicked and text not matching url', () => {
    const text = 'anchor text'
    const { getByText } = render(<ExternalLink text={text} url={someUrl} />)
    fireEvent.click(getByText('anchor'))
    expect(openURLSpy).toHaveBeenCalledWith(someUrl)
    expect(openURLSpy).toHaveBeenCalledTimes(1)
    openURLSpy.mockClear()
  })
  it('should open given url when icon clicked', () => {
    const { getByTestId } = render(<ExternalLink url={someUrl} />)
    fireEvent.click(getByTestId('externalSiteIcon'))
    expect(openURLSpy).toHaveBeenCalledWith(someUrl)
    expect(openURLSpy).toHaveBeenCalledTimes(1)
    openURLSpy.mockClear()
  })

  it('should display url with non breaking space when no text provided', () => {
    const text = undefined
    const { getByText } = render(<ExternalLink text={text} url={someUrl} />)
    expect(getByText(someUrl))
  })

  it('should display splitted text with non breaking space on first word', () => {
    const text = 'some text with several words'
    const { getByText } = render(<ExternalLink text={text} url={someUrl} />)
    expect(getByText('some'))
    expect(getByText('text with several words'))
  })
})
