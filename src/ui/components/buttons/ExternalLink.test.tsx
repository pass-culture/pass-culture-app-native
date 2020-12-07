import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'

import { ExternalLink } from './ExternalLink'

const openUrlSpy = jest.spyOn(Linking, 'openURL')
const someUrl = 'https://domain-that-does-not-exist.fr'

describe('ExternalLink', () => {
  it('should open given url when text clicked', () => {
    const { getByText } = render(<ExternalLink url={someUrl} />)
    fireEvent.press(getByText(someUrl))
    expect(openUrlSpy).toHaveBeenCalledWith(someUrl)
    expect(openUrlSpy).toHaveBeenCalledTimes(1)
    openUrlSpy.mockClear()
  })
  it('should open given url when text clicked and text not matching url', () => {
    const text = 'anchor text'
    const { getByText } = render(<ExternalLink text={text} url={someUrl} />)
    fireEvent.press(getByText(text))
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
})
