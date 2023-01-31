import React from 'react'
import { View, Text } from 'react-native'

import { render, waitFor, screen } from 'tests/utils'

import { E2eContextProvider, useIsE2e } from '../E2eContextProvider'

describe('<E2eContextProvider /> False', () => {
  it('should render with children and with value false when getIsE2e return false', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response)
    renderE2eContextProvider()
    await waitFor(async () => {
      await expect(screen.queryByTestId('false-test')).toBeTruthy()
    })
    await expect(screen.queryByTestId('true-test')).toBeFalsy()
    await expect(screen.getByTestId('false-test').children.join('')).toBe('hello false world')
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
