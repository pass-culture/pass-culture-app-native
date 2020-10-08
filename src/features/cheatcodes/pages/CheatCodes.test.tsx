import { render } from '@testing-library/react-native'
import React from 'react'

import { CheatCodes } from './CheatCodes'

describe('CheatCodes component', () => {
  const navigation = {
    dispatch: jest.fn(),
  } as any // eslint-disable-line @typescript-eslint/no-explicit-any

  it('should render correctly', async () => {
    const cheatCodes = render(<CheatCodes navigation={navigation} />)
    expect(cheatCodes).toMatchSnapshot()
  })
})
