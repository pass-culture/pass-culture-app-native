import { render, act } from '@testing-library/react-native'
import React from 'react'

import { env } from 'libs/environment'
import { flushAllPromises } from 'tests/utils'

import { Profile } from './Profile'

async function renderProfile() {
  const wrapper = render(<Profile />)
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}

describe('Profile component', () => {
  it('should have components and navigation buttons when NOT in PROD', async () => {
    const profile = await renderProfile()

    expect(() => profile.getByText('Composants')).toBeTruthy()
    expect(() => profile.getByText('Navigation')).toBeTruthy()
  })

  it('should NOT have components or navigation buttons when in PROD', async () => {
    env.ENV = 'production'
    const profile = await renderProfile()

    expect(() => profile.getByText('Composants')).toThrowError()
    expect(() => profile.getByText('Navigation')).toThrowError()
  })
})
