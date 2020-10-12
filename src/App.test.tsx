import { render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { App } from './App'

describe('App', () => {
  it('instantiate the application', async () => {
    const { getByText } = render(<App />)

    const welcomeText = await waitFor(() => getByText('Bienvenue à Pass Culture'))
    expect(welcomeText.props.children).toBe('Bienvenue à Pass Culture')
  })
})
