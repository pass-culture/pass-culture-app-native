import { render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { env } from 'libs/environment'

import { Home } from './Home'

jest.mock('libs/environment', () => ({
  env: {
    FEATURE_FLAG_CODE_PUSH: true,
  },
}))

describe('Home component', () => {
  const navigation = {
    navigate: jest.fn(),
  } as any // eslint-disable-line @typescript-eslint/no-explicit-any

  it('should have a welcome message', async () => {
    const { getByText } = render(<Home navigation={navigation} />)

    const welcomeText = await waitFor(() => getByText('Bienvenue !'))
    expect(welcomeText.props.children).toBe('Bienvenue !')
  })

  it('should render correctly', () => {
    const home = render(<Home navigation={navigation} />)
    expect(home).toMatchSnapshot()
  })

  it('should not have code push button', async () => {
    env.FEATURE_FLAG_CODE_PUSH_MANUAL = false
    const home = render(<Home navigation={navigation} />)
    expect(() => home.getByText('Check update')).toThrowError()
  })
})
