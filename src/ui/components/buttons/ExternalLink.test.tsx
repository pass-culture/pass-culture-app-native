import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { ExternalLink } from './ExternalLink'

const openUrlSpy = jest.spyOn(Linking, 'openURL')
const someUrl = 'https://domain-that-does-not-exist.fr'

describe('ExternalLink', () => {
  it('should open given url when text clicked', () => {
    const { getByText } = render(<ExternalLink url={someUrl} />)
    fireEvent.press(getByText('\u00a0' + someUrl))
    waitForExpect(() => {
      expect(openUrlSpy).toHaveBeenCalledWith(someUrl)
      expect(openUrlSpy).toHaveBeenCalledTimes(1)
    })
    openUrlSpy.mockClear()
  })
  it('should open given url when text clicked and text not matching url', () => {
    const text = 'anchor text'
    const { getByText } = render(<ExternalLink text={text} url={someUrl} />)
    fireEvent.press(getByText('\u00a0anchor'))
    expect(openUrlSpy).toHaveBeenCalledWith(someUrl)
    expect(openUrlSpy).toHaveBeenCalledTimes(1)
    openUrlSpy.mockClear()
  })
  it('should open given url when icon clicked', () => {
    const { getByTestId } = render(<ExternalLink url={someUrl} />)
    fireEvent.press(getByTestId('externalSiteIcon'))
    expect(openUrlSpy).toHaveBeenCalledWith(someUrl)
    expect(openUrlSpy).toHaveBeenCalledTimes(1)
    openUrlSpy.mockClear()
  })

  it('should display url with non breaking space when no text provided', () => {
    const text = undefined
    const { getByText } = render(<ExternalLink text={text} url={someUrl} />)
    expect(getByText('\u00a0' + someUrl))
  })

  it('should display splitted text with non breaking space on first word', () => {
    const text = 'some text with several words'
    const { getByText } = render(<ExternalLink text={text} url={someUrl} />)
    expect(getByText('\u00a0some'))
    expect(getByText(' text with several words'))
  })
})
