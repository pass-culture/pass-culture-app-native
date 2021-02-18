import { act, fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { storage } from 'libs/storage'
import { flushAllPromises } from 'tests/utils'

import { PrivacyPolicy } from './PrivacyPolicy'

describe('<PrivacyPolicy />', () => {
  afterEach(() => {
    storage.clear('has_accepted_cookie')
  })

  it('should render privacy policy', async () => {
    jest.useFakeTimers()
    const renderAPI = render(<PrivacyPolicy />)
    await act(flushAllPromises)

    jest.advanceTimersByTime(1000)

    expect(renderAPI).toMatchSnapshot()
    jest.useRealTimers()
  })

  it('should show modal when has_accepted_cookie is null', async () => {
    const renderAPI = render(<PrivacyPolicy />)
    await act(flushAllPromises)

    const title = renderAPI.queryByText('Respect de ta vie privée')
    expect(title).toBeTruthy()
  })

  it('should NOT show modal when has_accepted_cookie is false', async () => {
    await storage.saveObject('has_accepted_cookie', false)
    const renderAPI = render(<PrivacyPolicy />)
    await act(flushAllPromises)

    const title = renderAPI.queryByText('Respect de ta vie privée')
    expect(title).toBeFalsy()
  })

  it('should NOT show modal when has_accepted_cookie is true', async () => {
    await storage.saveObject('has_accepted_cookie', true)
    const renderAPI = render(<PrivacyPolicy />)
    await act(flushAllPromises)

    const title = renderAPI.queryByText('Respect de ta vie privée')
    expect(title).toBeFalsy()
  })

  it('should close modal and set has_accepted_cookie to true in storage on dismiss', async () => {
    expect(await storage.readObject('has_accepted_cookie')).toBeNull()
    const renderAPI = render(<PrivacyPolicy />)
    await act(flushAllPromises)

    expect(await storage.readObject('has_accepted_cookie')).toBeNull()
    const title = renderAPI.queryByText('Respect de ta vie privée')
    expect(title).toBeTruthy()

    fireEvent.press(renderAPI.getByText('Continuer'))
    await act(flushAllPromises)

    expect(await storage.readObject('has_accepted_cookie')).toBe(true)
    expect(renderAPI.queryByText('Continuer')).toBeFalsy()
  })
})
