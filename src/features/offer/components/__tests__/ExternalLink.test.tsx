import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'

import { ExternalLink } from '../ExternalLink'

const openUrlSpy = jest.spyOn(Linking, 'openURL')
const someUrl = 'https://domain-that-does-not-exist.fr'

describe('ExternalLink', () => {
  it('should open given url', () => {
    const { getByText, getByTestId } = render(<ExternalLink url={someUrl} />)
    fireEvent.press(getByText(someUrl))
    expect(openUrlSpy).toHaveBeenCalledWith(someUrl)
    expect(openUrlSpy).toHaveBeenCalledTimes(1)
    openUrlSpy.mockClear()
    fireEvent.press(getByTestId('externalSiteIcon'))
    expect(openUrlSpy).toHaveBeenCalledWith(someUrl)
    expect(openUrlSpy).toHaveBeenCalledTimes(1)
  })
})
