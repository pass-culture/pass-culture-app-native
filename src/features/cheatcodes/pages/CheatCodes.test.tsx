import { render } from '@testing-library/react-native'
import React from 'react'

import { env } from 'libs/environment'

import { CheatCodes } from './CheatCodes'

jest.mock('libs/environment', () => ({
  env: {
    FEATURE_FLAG_CODE_PUSH: true,
  },
}))

describe('CheatCodes component', () => {
  const navigation = {
    dispatch: jest.fn(),
  } as any // eslint-disable-line @typescript-eslint/no-explicit-any

  it('should render correctly', async () => {
    const cheatCodes = render(<CheatCodes navigation={navigation} />)
    expect(cheatCodes).toMatchSnapshot()
  })

  it('should have a button to go to the Login', async () => {
    env.FEATURE_FLAG_CODE_PUSH = false
    const cheatCodes = render(<CheatCodes navigation={navigation} />)
    expect(() => cheatCodes.getByText('Check update')).toThrowError()
  })
})
