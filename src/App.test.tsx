import { render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { App } from './App'
import * as BatchLocalLib from './libs/notifications'

jest.mock('./libs/notifications', () => ({
  startBatchNotification: jest.fn(),
}))

describe('App', () => {
  it('should display a a prompt to sign-in message', async () => {
    const { getByText } = render(<App />)

    const welcomeText = await waitFor(() => getByText('Connectez-vous :'))
    expect(welcomeText.props.children).toBe('Connectez-vous :')
  })
  it('should call startBatchNotification to optin to notifications', () => {
    render(<App />)
    expect(BatchLocalLib.startBatchNotification).toHaveBeenCalled()
  })
})
