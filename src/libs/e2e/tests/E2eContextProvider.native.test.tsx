import React from 'react'
import { View, Text } from 'react-native'

import { render, waitFor, screen } from 'tests/utils'

import { E2eContextProvider, useIsE2e } from '../E2eContextProvider'

describe('<E2eContextProvider />', () => {
  it('should render with children and with value true when getIsE2e return true', async () => {
    process.env.NODE_ENV = 'development'
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
    } as Response)
    renderE2eContextProvider()
    await waitFor(async () => {
      await expect(screen.queryByTestId('true-test')).toBeTruthy()
    })
    await expect(screen.queryByTestId('false-test')).toBeFalsy()
    await expect(screen.getByTestId('true-test').children.join('')).toBe('hello true world')
    process.env.NODE_ENV = 'test'
  })
})

function renderE2eContextProvider() {
  return render(
    <E2eContextProvider>
      <MockChildren />
    </E2eContextProvider>
  )
}

const MockChildren = () => {
  const isE2e = useIsE2e()
  return (
    <View>
      <Text testID={`${String(isE2e)}-test`}>hello {String(isE2e)} world</Text>
    </View>
  )
}
