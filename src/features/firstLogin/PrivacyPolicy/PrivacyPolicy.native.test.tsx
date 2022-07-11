import React from 'react'

import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { flushAllPromisesWithAct, fireEvent, render } from 'tests/utils'

import { PrivacyPolicy } from './PrivacyPolicy'

describe('<PrivacyPolicy />', () => {
  afterEach(() => {
    storage.clear('has_accepted_cookie')
  })

  it('should render privacy policy', async () => {
    jest.useFakeTimers()
    const renderAPI = render(<PrivacyPolicy />)
    await flushAllPromisesWithAct()

    jest.advanceTimersByTime(1000)

    expect(renderAPI).toMatchSnapshot()
    jest.useRealTimers()
  })

  it('should show modal when has_accepted_cookie is null', async () => {
    const renderAPI = render(<PrivacyPolicy />)
    await flushAllPromisesWithAct()

    const title = renderAPI.queryByText('Respect de ta vie privée')
    expect(title).toBeTruthy()
  })

  it('should NOT show modal when has_accepted_cookie is false', async () => {
    await storage.saveObject('has_accepted_cookie', false)
    const renderAPI = render(<PrivacyPolicy />)
    await flushAllPromisesWithAct()

    const title = renderAPI.queryByText('Respect de ta vie privée')
    expect(title).toBeFalsy()
  })

  it('should NOT show modal when has_accepted_cookie is true', async () => {
    await storage.saveObject('has_accepted_cookie', true)
    const renderAPI = render(<PrivacyPolicy />)
    await flushAllPromisesWithAct()

    const title = renderAPI.queryByText('Respect de ta vie privée')
    expect(title).toBeFalsy()
  })

  it('should close modal and set has_accepted_cookie to true in storage on approval', async () => {
    expect(await storage.readObject('has_accepted_cookie')).toBeNull()
    const renderAPI = render(<PrivacyPolicy />)
    await flushAllPromisesWithAct()

    expect(await storage.readObject('has_accepted_cookie')).toBeNull()
    const title = renderAPI.queryByText('Respect de ta vie privée')
    expect(title).toBeTruthy()

    fireEvent.press(renderAPI.getByText('Autoriser'))
    await flushAllPromisesWithAct()

    expect(await storage.readObject('has_accepted_cookie')).toBe(true)
    expect(renderAPI.queryByText('Autoriser')).toBeNull()
  })

  it('should close modal and set has_accepted_cookie to false in storage on refusal', async () => {
    expect(await storage.readObject('has_accepted_cookie')).toBeNull()
    const renderAPI = render(<PrivacyPolicy />)
    await flushAllPromisesWithAct()

    expect(await storage.readObject('has_accepted_cookie')).toBeNull()
    const title = renderAPI.queryByText('Respect de ta vie privée')
    expect(title).toBeTruthy()

    fireEvent.press(renderAPI.getByTestId('rightIcon'))
    await flushAllPromisesWithAct()

    expect(await storage.readObject('has_accepted_cookie')).toBe(false)
    expect(renderAPI.queryByText('Autoriser')).toBeNull()
    expect(analytics.logHasRefusedCookie).toHaveBeenCalled()
    await flushAllPromisesWithAct()
    expect(analytics.disableCollection).toHaveBeenCalled()
  })
})
