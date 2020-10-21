import { Batch } from '@bam.tech/react-native-batch'
import { render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { App } from './App'

describe('App', () => {
  it('should display a a prompt to sign-in message', async () => {
    const { getByText } = render(<App />)

    const welcomeText = await waitFor(() => getByText('Connectez-vous :'))
    expect(welcomeText.props.children).toBe('Connectez-vous :')
  })
  it('should call Batch.start to optin notifications', () => {
    render(<App />)
    expect(Batch.start).toHaveBeenCalled()
  })
})
